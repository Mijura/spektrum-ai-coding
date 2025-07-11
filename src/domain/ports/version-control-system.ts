import { SourceCode } from "@domain/types/source-code"

export interface VersionControlSystem {

    /**
     * Pushes the source code to the version control system
     * @param projectId - The ID of the project to push the source code to
     * @param sourceCode - The source code to push to the version control system
     * @returns The version id of the pushed source code
     */
    push(projectId: string, sourceCode: SourceCode): Promise<string>

    /**
     * Pulls the source code from the version control system
     * @param versionId - The ID of the version to pull the source code from
     * @returns The source code of the pulled version
     */
    pull(versionId: string): Promise<SourceCode>

    /**
     * Removes the source code from the version control system
     * @param projectId - The ID of the project to remove the source code from
     * @returns The removed source code
     */
    remove(projectId: string): Promise<void>
}