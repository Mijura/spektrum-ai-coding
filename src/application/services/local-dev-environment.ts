import path from "path"

import { VersionControlSystem } from "@domain/ports/version-control-system"
import { VersionRepository } from "@domain/ports/repositories/version-repository"
import { ProjectRepository } from "@domain/ports/repositories/project-repository"
import { Version } from "@domain/value-objects/version"
import { Template } from "@domain/ports/templates/template"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { DevEnvironment } from "@domain/ports/services/dev-environment"
import { Bundler } from "@domain/ports/bundlers/bundler"
import { FileSystemPort } from "@domain/ports/filesystem/file-system"
import { HostingService } from "@domain/ports/services/hosting-service"

export class LocalDevEnvironment implements DevEnvironment {

	constructor(
		private readonly hostingService: HostingService,
		private readonly projectRepository: ProjectRepository,
		private readonly versionControlSystem: VersionControlSystem,
		private readonly versionRepository: VersionRepository,
		private readonly template: Template,
		private readonly jsBundler: Bundler,
		private readonly fileSystem: FileSystemPort
	) {}
	
	async setupProject(projectId: string): Promise<Version> {
		try {

			// Deploy the prebuilt files
			const prebuiltFiles: FileArtifacts = await this.template.fetchPrebuiltFiles()
			await this.hostingService.deployPrebuiltCode(prebuiltFiles)
			console.log('Template deployed successfully!')

			// Save the version
			const version = Version.create(projectId)
			const sourceCode: FileArtifacts = await this.template.fetchSourceCode()
			await this.versionControlSystem.push(version, sourceCode)
			await this.versionRepository.save(version)
			console.log('Source code versioned and saved successfully!')

			return version
		} catch (error) {
			console.error(`Error initializing project ${projectId}:`, error)
			throw new Error("Project initialization failed.")
		}
	}

	async applySourceCode(projectId: string, sourceCode: FileArtifacts): Promise<Version> {
		const projectPath = path.resolve(`projects/${projectId}`)		

		// TODO: Fetch the source code from the version control system and merge with the passed source code

		// write the source code to the file system
		let promises = []
		for (const [filePath, fileContent] of Object.entries(sourceCode)) {
			const fullPath = path.join(projectPath, filePath)
			await this.fileSystem.ensureFile(fullPath)
			const writingPromise = await this.fileSystem.writeFile(fullPath, fileContent)
			promises.push(writingPromise)
		}

		await Promise.all(promises)
		// Bundle the source code
		const bundledFiles = await this.jsBundler.bundle(projectPath)
		await this.hostingService.deployPrebuiltCode(bundledFiles)

		// Save the version
		const version = Version.create(projectId)
		await this.versionControlSystem.push(version, sourceCode)
		await this.versionRepository.save(version)
		console.log('Source code versioned and saved successfully!')
		return version
	}

	async deployToProduction(projectId: string): Promise<Version> {
		const project = await this.projectRepository.get(projectId)
		const projectPath = path.resolve(`projects/${projectId}`)

		const latestVersion = project.latestDevDeployment?.version
		if(!latestVersion) {
			throw new Error("Dev environment not found")
		}

		const sourceCode = await this.versionControlSystem.pull(latestVersion)
		// TODO: Write the source code to the file system or even better
		// TODO: Save prebuilt files to version control system
		// TODO: Fetch & deploy prebuilt files to production environment
		const bundledFiles = await this.jsBundler.bundle(projectPath)


		await this.hostingService.deployPrebuiltCode(bundledFiles)

		// Save the version
		const version = Version.create(projectId)
		await this.versionControlSystem.push(version, sourceCode)
		await this.versionRepository.save(version)
		console.log('Source code versioned and saved successfully!')

		return version

	}	


}
