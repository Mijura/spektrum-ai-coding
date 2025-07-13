import path from "path"

import { PackageManager } from "../../domain/ports/package-manager"
import { FrontendDevelopmentService } from "@domain/services/frontend-development"
import { SourceCode } from "@domain/types/source-code"
import { FileSystemPort } from "../../domain/ports/file-system"
import { VersionControlSystem } from "@domain/ports/version-control-system"
import { FileStorage } from "../../domain/ports/file-storage"
import { Environment, Version } from "@domain/entities/version"
import { VersionRepository } from "@domain/repositories/version-repository"
import { ProjectRepository } from "@domain/repositories/project-repository"

export class FrontendDevelopment implements FrontendDevelopmentService {

	constructor(
		private readonly packageManager: PackageManager, 
		private readonly fileSystem: FileSystemPort,
		private readonly fileStorage: FileStorage,
		private readonly projectRepository: ProjectRepository,
		private readonly versionControlSystem: VersionControlSystem,
		private readonly versionRepository: VersionRepository
	) {}
	
	async setupProject(projectId: string): Promise<Version> {
		try {
			const projectPath: string = path.join("projects", projectId)

			const templateName = "rspack-react-tailwind"
			const templatePath = path.resolve(`src/application/templates/${templateName}`)

			console.log("Template path:", templatePath)

			await this.fileSystem.copyFolder(templatePath, projectPath)
			console.log(`✅ Project template copied to ${projectPath}`)

			await this.deployToDevEnvironment(projectId)

			console.log(`Project ${projectId} initialized and built successfully!`)

			const sourceCode = await this.getSourceCode(projectId)
			const version = Version.create(projectId, Environment.DEV)
			await this.versionControlSystem.push(version, sourceCode)
			await this.versionRepository.save(version)
			return version
		} catch (error) {
			console.error(`Error initializing project ${projectId}:`, error)
			throw new Error("Project initialization failed.")
		}
	}

	async applySourceCode(projectId: string, sourceCode: SourceCode): Promise<Version> {
		const projectPath = path.resolve(`projects/${projectId}`)

		// Update the source code
		let promises = []
		for (const [filePath, fileContent] of Object.entries(sourceCode)) {
			const fullPath = path.join(projectPath, filePath)
			await this.fileSystem.ensureFile(fullPath)
			const writingPromise = await this.fileSystem.writeFile(fullPath, fileContent)
			promises.push(writingPromise)
		}

		await Promise.all(promises)
		const updatedSourceCode = await this.getSourceCode(projectId)

		// Deploy the updated source code
		await this.packageManager.installDependencies(projectPath)
		await this.packageManager.buildProject(projectPath)
		await this.deployToDevEnvironment(projectId)

		const version = Version.create(projectId, Environment.DEV)
		// Save the version
		await this.versionControlSystem.push(version, updatedSourceCode)
		await this.versionRepository.save(version)
		return version
	}

	async deployToProduction(projectId: string): Promise<Version> {
		const sourceCode = await this.versionControlSystem.pull(versionId)
		const distFolder: string = `projects/${versionId}/dist`
		
		console.log("Uploading project to dev environment...")
		const buildPath: string = path.resolve(distFolder)
		const folderName = projectId

		if (!buildPath || !folderName) {
			throw new Error("Deplyment failed")
		}

		await this.uploadFiles(buildPath, folderName)
		const version = Version.create(projectId, Environment.PROD)
		await this.versionControlSystem.push(version, sourceCode)
		return version

	}

	private async deployToDevEnvironment(projectId: string): Promise<void> {
		const buildPath: string = path.resolve(`projects/${projectId}/dist`)
		const folderName = projectId

		if (!buildPath || !folderName) {
			throw new Error("Deplyment failed")
		}

		await this.uploadFiles(buildPath, folderName)
	}

	private async uploadFiles(sourceCodeFolder: string, destinationFolder: string) {
		const allFiles = await this.fileSystem.readDirectory(sourceCodeFolder)

		for (const fileName of allFiles) {
			const fullPath = path.join(sourceCodeFolder, fileName)
			const stream = this.fileSystem.createReadStream(fullPath)
			await this.fileStorage.uploadFile(fileName, stream, destinationFolder)
		}
	}
	

	private async getSourceCode(projectId: string): Promise<SourceCode> {

		const projectPath = path.join("projects", projectId)
		const sourceCode: SourceCode = {}
		const blacklist = new Set(["yarn.lock", ".env.example", "node_modules", "dist"])

		const readDir = async (directory: string, relativePath = "") => {
			const files = await this.fileSystem.readDirectory(directory)

			for (const file of files) {
				if (blacklist.has(file)) continue

				const filePath = path.join(directory, file)
				const fileRelativePath = path.join(relativePath, file)

				if (await this.fileSystem.isDirectory(filePath)) {
					await readDir(filePath, fileRelativePath)
				} else {
					sourceCode[fileRelativePath] = await this.fileSystem.readFile(filePath, "utf8")
				}
			}
		}

		await readDir(projectPath)
		return sourceCode
	}


}
