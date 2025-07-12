import { SourceCode } from "@domain/types/source-code"

export interface VersionControlSystem {

    /**
     * Pushes the source code to the version control system
     * @param versionId - The ID of the version to push the source code to
     * @param sourceCode - The source code to push to the version control system
     */
    push(versionId: string, sourceCode: SourceCode): Promise<void>

    /**
     * Pulls the source code from the version control system
     * @param versionId - The ID of the version to pull the source code from
     * @returns The source code for the given version
     */
    pull(versionId: string): Promise<SourceCode>

    
    /**
     * Removes the source code from the version control system
     * @param versionId - The ID of the version to remove the source code from  
     */
    remove(versionId: string): Promise<void>
}