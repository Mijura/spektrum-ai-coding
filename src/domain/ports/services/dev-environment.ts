import { FileArtifacts } from "@domain/value-objects/file-artifacts"

/**
 * LocalEnvironment is a service that allows you to setup, maintain and deploy a frontend project.
 */
export interface DevEnvironment {

	/**
	 * Updates the source code for the project on the dev environment
	 * @param projectId - The ID of the project to update the source code for
	 * @param sourceCode - The source code to update the project with
	 * @returns The version details of the updated project
	 */
	build(sourceCode: FileArtifacts): Promise<FileArtifacts>

}
