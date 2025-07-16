import path from "path"

import { SourceCode } from "@domain/types/source-code"
import { FileSystemPort } from "../../domain/ports/file-system"
import { VersionControlSystem } from "@domain/ports/version-control-system"
import { VersionRepository } from "@domain/ports/repositories/version-repository"
import { ProjectRepository } from "@domain/ports/repositories/project-repository"
import { FrontendDevelopmentService } from "@domain/ports/services/frontend-development"
import { FrontendDeploymentService } from "@domain/ports/services/frontend-deployment"
import { EnvironmentConfig } from "@domain/entities/project"
import { Version } from "@domain/entities/version"

export class FrontendDevelopment implements FrontendDevelopmentService {

	constructor(
		private readonly fileSystem: FileSystemPort,
		private readonly frontendDeploymentService: FrontendDeploymentService,
		private readonly projectRepository: ProjectRepository,
		private readonly versionControlSystem: VersionControlSystem,
		private readonly versionRepository: VersionRepository
	) {}
	
	async setupProject(projectId: string): Promise<Version> {
		try {
			const project = await this.projectRepository.get(projectId)

			const projectPath: string = path.join("projects", projectId)

			const templateName = "rspack-react-tailwind"
			const templatePath = path.resolve(`src/application/templates/${templateName}`)
			console.log("Template path:", templatePath)

			// we are using pre-built template to speed up the process
			await this.fileSystem.copyFolder(templatePath, projectPath)
			console.log(`✅ Project template copied to ${projectPath}`)
			
			const version = Version.create(projectId, Environment.DEV)
			const url = await this.frontendDeploymentService.deploy(projectPath, version, false)
			const sourceCode = await this.getSourceCode(projectId)

			const environmentConfig: EnvironmentConfig = {
				url,
				version
			}
			project.setDevEnvironment(environmentConfig)

			await this.versionControlSystem.push(version, sourceCode)
			await this.versionRepository.save(version)


			console.log(`Project ${projectId} initialized and built successfully!`)

			return version
		} catch (error) {
			console.error(`Error initializing project ${projectId}:`, error)
			throw new Error("Project initialization failed.")
		}
	}

	async applySourceCode(projectId: string, sourceCode: SourceCode): Promise<Version> {
		const projectPath = path.resolve(`projects/${projectId}`)

		const project = await this.projectRepository.get(projectId)

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

		const version = Version.create(projectId, Environment.DEV)
		const url = await this.frontendDeploymentService.deploy(projectPath, version)

		const environmentConfig: EnvironmentConfig = {
			url,
			version
		}
		project.setDevEnvironment(environmentConfig)

		// Save the version
		await this.versionControlSystem.push(version, updatedSourceCode)
		await this.versionRepository.save(version)
		return version
	}

	async deployToProduction(projectId: string): Promise<Version> {
		const project = await this.projectRepository.get(projectId)
		const projectPath = path.resolve(`projects/${projectId}`)
		if(!project.devConfig) {
			throw new Error("Dev environment not found")
		}

		const sourceCode = await this.versionControlSystem.pull(project.devConfig.version)
		
		console.log("Uploading project to dev environment...")


		const version = Version.create(projectId, Environment.PROD)
		const url = await this.frontendDeploymentService.deploy(projectPath, version)

		const environmentConfig: EnvironmentConfig = {
			url,
			version
		}
		project.setProdEnvironment(environmentConfig)

		await this.versionControlSystem.push(version, sourceCode)
		await this.versionRepository.save(version)

		return version

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
