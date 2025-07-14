import { Version } from "@domain/entities/version"
import { SourceCode } from "@domain/types/source-code"

/**
 * FrontendDevelopmentService is a service that allows you to setup, maintain and deploy a frontend project.
 */
export interface FrontendDevelopmentService {
	/**
	 * Initializes empty React project on the dev environment
	 * @param projectId - The ID of the project to initialize
	 * @returns The version details of the initialized project
	 */
	setupProject(projectId: string): Promise<Version>

	/**
	 * Updates the source code for the project on the dev environment
	 * @param projectId - The ID of the project to update the source code for
	 * @param sourceCode - The source code to update the project with
	 * @returns The version details of the updated project
	 */
	applySourceCode(projectId: string, sourceCode: SourceCode): Promise<Version>

	/**
	 * Deploy the project to prodcution
	 * @param projectId - The ID of the project to build
	 * @returns The version details of the deployed project
	 */
	deployToProduction(projectId: string): Promise<Version>


}
