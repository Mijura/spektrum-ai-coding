import { Project } from "@domain/entities/project"
import { SourceCode } from "@domain/entities/source-code"
export interface FrontendDevelopmentService {
	/**
	 * Initializes project by copying the template (project-templates/rspack-react-tailwind), installing dependencies, and building the project
	 * @param projectId - The ID of the project to initialize
	 */
	setupProject(projectId: string): Promise<void>

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
	updateSourceCode(projectId: string, sourceCode: SourceCode): Promise<void>


	/**
	 * Gets the path to the static files for a project
	 * @param projectId - The ID of the project to get the static files path for
	 * @returns The path to the static files for the project or null if the project is not found
	 */
	getStaticFilesPath(projectId: string): Promise<string | null>
}
