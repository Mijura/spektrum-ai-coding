import path from "path"

import { VersionControlSystem } from "@domain/ports/version-control-system"
import { VersionRepository } from "@domain/ports/repositories/version-repository"
import { ProjectRepository } from "@domain/ports/repositories/project-repository"
import { Version } from "@domain/value-objects/version"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { DevEnvironment } from "@domain/ports/services/dev-environment"
import { Bundler } from "@domain/ports/bundlers/bundler"
import { FileSystemPort } from "@domain/ports/filesystem/file-system"
import { WebHostingService } from "@domain/ports/services/web-hosting-service"
import { Commit } from "@domain/value-objects/commit"

export class LocalDevEnvironment implements DevEnvironment {

	constructor(
		private readonly webHostingService: WebHostingService,
		private readonly projectRepository: ProjectRepository,
		private readonly versionControlSystem: VersionControlSystem,
		private readonly versionRepository: VersionRepository,
		private readonly jsBundler: Bundler,
		private readonly fileSystem: FileSystemPort
	) {}

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
		const buildArtifact = await this.jsBundler.bundle(projectPath)
		await this.webHostingService.deployPrebuiltCode(buildArtifact)

		const commit: Commit = { buildArtifact, sourceCode }
		// Save the version
		const version = Version.create(projectId)
		await this.versionControlSystem.commitVersion(projectId, commit)
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

		const sourceCode = await this.versionControlSystem.pullSourceCode(latestVersion)
		// TODO: Write the source code to the file system or even better
		// TODO: Save prebuilt files to version control system
		// TODO: Fetch & deploy prebuilt files to production environment
		const buildArtifact = await this.jsBundler.bundle(projectPath)


		await this.webHostingService.deployPrebuiltCode(buildArtifact)

		const commit: Commit = { buildArtifact, sourceCode }
		// Save the version
		const version = Version.create(projectId)
		await this.versionControlSystem.commitVersion(projectId, commit)
		await this.versionRepository.save(version)
		console.log('Source code versioned and saved successfully!')

		return version

	}	


}
