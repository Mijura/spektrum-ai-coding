import path from "path"

import { PackageManager } from "../interfaces/package-manager"
import { FrontendDevelopmentService } from "@domain/services/frontend-development"
import { Project } from "@domain/entities/project"
import { SourceCode } from "@domain/types/source-code"
import { FileSystemPort } from "../interfaces/file-system"
import { DeploymentTargetPort } from "../interfaces/deployment-target"

export class FrontendDevelopment implements FrontendDevelopmentService {
	constructor(
		private readonly packageManager: PackageManager, 
		private readonly fileSystem: FileSystemPort, 
		private readonly deploymentTarget: DeploymentTargetPort) {}

	async setupProject(project: Project): Promise<SourceCode> {
		try {
			const projectPath: string = path.join("projects", project.id)

			const templateName = "rspack-react-tailwind"
			const templatePath = path.resolve(`src/application/templates/${templateName}`)

			console.log("Template path:", templatePath)

			await this.fileSystem.copyFolder(templatePath, projectPath)
			console.log(`✅ Project template copied to ${projectPath}`)

			await this.deployToDevEnvironment(project.id)

			console.log(`Project ${project.id} initialized and built successfully!`)

			return await this.fetchSourceCode(project.id)
		} catch (error) {
			console.error(`Error initializing project ${project.id}:`, error)
			throw new Error("Project initialization failed.")
		}
	}

	async installDependencies(projectId: string): Promise<boolean> {
		const projectPath: string = path.join("projects", projectId)
		const installSuccess = await this.packageManager.installDependencies(projectPath)
		return installSuccess
	}

	async buildProject(projectId: string): Promise<boolean> {
		const projectPath: string = path.join("projects", projectId)
		const buildSuccess = await this.packageManager.buildProject(projectPath)
		return buildSuccess
	}

	async deployToDevEnvironment(projectId: string): Promise<void> {
		const buildPath: string = path.resolve(`projects/${projectId}/dist`)
		const folderName = projectId

		if (!buildPath || !folderName) {
			throw new Error("Deplyment failed")
		}

		await this.uploadFiles(buildPath, folderName)
	}

	async deployProject(project: Project): Promise<void> {
		const buildPath: string = path.resolve(`projects/${project.id}/dist`)
		const folderName = project.deploymentId

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
			await this.deploymentTarget.uploadFile(fileName, stream, destinationFolder)
		}
	}
	

	async fetchSourceCode(projectId: string): Promise<SourceCode> {

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

	async updateSourceCode(projectId: string, sourceCode: SourceCode): Promise<void> {
		const projectPath = path.resolve(`projects/${projectId}`)
		let promises = []
		for (const [filePath, fileContent] of Object.entries(sourceCode)) {
			const fullPath = path.join(projectPath, filePath)
			await this.fileSystem.ensureFile(fullPath)
			const writingPromise = await this.fileSystem.writeFile(fullPath, fileContent)
			promises.push(writingPromise)
		}

		await Promise.all(promises)
	}

	async getStaticFilesPath(projectId: string): Promise<string | null> {
		const projectPath = path.resolve(`projects/${projectId}/dist`)
		return (await this.fileSystem.exists(projectPath)) ? projectPath : null
	}
}
