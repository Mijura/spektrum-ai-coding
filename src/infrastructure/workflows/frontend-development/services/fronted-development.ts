import path from "path"

import { PackageManager } from "../../../../domain/ports/package-manager"
import { FrontendDevelopmentService } from "@domain/ports/frontend-development"
import { SourceCode } from "@domain/types/source-code"
import { FileSystemPort } from "../../../../domain/ports/file-system"
import { VersionControlSystem } from "@domain/ports/version-control-system"
import { FileStorage } from "../../../../domain/ports/file-storage"
export class FrontendDevelopment implements FrontendDevelopmentService {
	constructor(
		private readonly packageManager: PackageManager, 
		private readonly fileSystem: FileSystemPort,
		private readonly fileStorage: FileStorage,
		private readonly versionControlSystem: VersionControlSystem
	) {}
	
	async setup(projectId: string): Promise<string> {
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
			return await this.versionControlSystem.push(projectId, sourceCode)
		} catch (error) {
			console.error(`Error initializing project ${projectId}:`, error)
			throw new Error("Project initialization failed.")
		}
	}

	async update(projectId: string, sourceCode: SourceCode): Promise<string> {
		const projectPath = path.resolve(`projects/${projectId}`)
		let promises = []
		for (const [filePath, fileContent] of Object.entries(sourceCode)) {
			const fullPath = path.join(projectPath, filePath)
			await this.fileSystem.ensureFile(fullPath)
			const writingPromise = await this.fileSystem.writeFile(fullPath, fileContent)
			promises.push(writingPromise)
		}

		await Promise.all(promises)
		const updatedSourceCode = await this.getSourceCode(projectId)

		return await this.versionControlSystem.push(projectId, updatedSourceCode)
	}

	async deploy(projectId: string, versionId: string): Promise<string> {
		const sourceCode = await this.versionControlSystem.pull(versionId)
		const distFolder: string = `projects/${versionId}/dist`
		
		console.log("Uploading project to dev environment...")
		const buildPath: string = path.resolve(distFolder)
		const folderName = projectId

		if (!buildPath || !folderName) {
			throw new Error("Deplyment failed")
		}

		await this.uploadFiles(buildPath, folderName)
	}

	private async installDependencies(projectId: string): Promise<boolean> {
		const projectPath: string = path.join("projects", projectId)
		const installSuccess = await this.packageManager.installDependencies(projectPath)
		return installSuccess
	}

	private async buildProject(projectId: string): Promise<boolean> {
		const projectPath: string = path.join("projects", projectId)
		const buildSuccess = await this.packageManager.buildProject(projectPath)
		return buildSuccess
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
