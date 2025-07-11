import { SourceCode } from "@domain/types/source-code"

/**
 * FrontendDevelopmentService is a service that allows you to setup, maintain and deploy a frontend project.
 */
export interface FrontendDevelopmentService {
	/**
	 * Initializes empty React project
	 * @param projectId - The ID of the project to initialize
	 * @returns The version id of the initialized project
	 */
	setup(projectId: string): Promise<string>

	/**
	 * Updates the source code for the project
	 * @param projectId - The ID of the project to update the source code for
	 * @param sourceCode - The source code to update the project with
	 * @returns The version id of the updated project
	 */
	update(projectId: string, sourceCode: SourceCode): Promise<string>

	/**
	 * Deploy the project to prodcution
	 * @param projectId - The ID of the project to build
	 * @param deploymentId - The ID of the production deployment
	 * @returns the url of the deployed project
	 */
	deploy(projectId: string): Promise<string>


}
