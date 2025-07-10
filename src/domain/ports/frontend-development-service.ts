import { Project } from "@domain/entities/project"
import { SourceCode } from "@domain/types/source-code"

/**
 * FrontendDevelopmentService is a service that allows you to initialize, install dependencies, build, deploy, fetch, write, restore, remove, and get static files for a project.
 */
export interface FrontendDevelopmentService {
	/**
	 * Initializes project by copying the template, installing dependencies, and building the project
	 * @param projectId - The ID of the project to initialize
	 */
	setupProject(project: Project): Promise<SourceCode>

	/**
	 * Installs dependencies for the project
	 * @param projectId - The ID of the project to install dependencies for
	 */
	installDependencies(projectId: string): Promise<boolean>

	/**
	 * Builds the project
	 * @param projectId - The ID of the project to build
	 */
	buildProject(projectId: string): Promise<boolean>

	/**
	 * Deploy the project to the dev environment
	 * @param projectId - The ID of the project to deploy
	 */
	deployToDevEnvironment(projectId: string): Promise<void>

	/**
	 * Deploy the project
	 * @param projectId - The ID of the project to build
	 * @param deploymentId - The ID of the production deployment
	 * @returns the id of deployed project
	 */
	deployProject(project: Project): Promise<void>

	/**
	 * Fetches the source code for a project
	 * @param projectId - The ID of the project to fetch the source code for
	 * @returns The source code for the project
	 */
	fetchSourceCode(projectId: string): Promise<SourceCode>

	/**
	 * Writes the source code to the project
	 * @param projectId - The ID of the project to write the source code to
	 * @param sourceCode - The source code to write to the project
	 */
	updateSourceCode(projectId: string, sourceCode: SourceCode): Promise<SourceCode>

	/**
	 * Restores the project from the source code if not exists on filesystem
	 * @param project - The project to restore
	 */
	restoreProject(project: Project): Promise<void>

	/**
	 * Restores the source code from the source code if not exists on filesystem
	 * @param project - The project to restore
	 */
	restoreSourceCode(project: Project): Promise<void>

	/**
	 * Removes the source code from the filesystem
	 * @param projectId - The ID of the project to remove the source code from
	 */
	removeSourceCodeFromFileSystem(projectId: string): Promise<void>

}
