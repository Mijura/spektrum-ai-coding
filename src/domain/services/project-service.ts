import path from "path"
import { PackageManagerPort } from "../ports/outbound/package-manager-port"
import { GithubServicePort } from "@domain/ports/outbound/github-service-port"

export class ProjectService {
	constructor(
		private readonly githubService: GithubServicePort, // Adapter for file system operations
		private readonly packageManager: PackageManagerPort // Adapter for package management (Yarn)
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
}
