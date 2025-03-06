import path from "path"
import { PackageManager } from "@domain/ports/outbound/package-manager"
import { GithubService } from "@domain/ports/outbound/github-service"
import { FileSystemPort } from "@domain/ports/outbound/file-system"

export class ProjectService {
	constructor(
		private readonly githubService: GithubService, // Adapter for file system operations
		private readonly packageManager: PackageManager, // Adapter for package management (Yarn)
        private readonly fileSystem: FileSystemPort // Adapter for file system operations
	) {}

	// Initializes project by copying the template (creating folder structure), installing dependencies, and building the project
	async setupProject(projectId: string): Promise<void> {
		try {
			const projectPath: string = path.join("projects", projectId) // Path for the new project

			// 1. Copy the project template
			await this.githubService.cloneTemplate(projectPath)

			// 2. Install dependencies
			const installSuccess = await this.packageManager.installDependencies(projectPath)
			if (!installSuccess) {
				throw new Error("Failed to install dependencies.")
			}

			// 3. Build the project
			const buildSuccess = await this.packageManager.buildProject(projectPath)
			if (!buildSuccess) {
				throw new Error("Failed to build the project.")
			}

			console.log(`Project ${projectId} initialized and built successfully!`)
		} catch (error) {
			console.error(`Error initializing project ${projectId}:`, error)
			throw new Error("Project initialization failed.")
		}
	}

	async getStaticFilesPath(projectId: string): Promise<string | null> {
		const projectPath = path.resolve(`projects/${projectId}/dist`)
		return this.fileSystem.exists(projectPath) ? projectPath : null
	}

	async getIndexFilePath(projectId: string): Promise<string | null> {
		const indexPath = path.resolve(`projects/${projectId}/dist/index.html`)
		return this.fileSystem.exists(indexPath) ? indexPath : null
	}
}
