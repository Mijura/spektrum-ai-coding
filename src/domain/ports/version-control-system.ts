import { Version } from "@domain/value-objects/version"
import { SourceCode } from "@domain/value-objects/source-code"

export interface VersionControlSystem {

    /**
     * Pushes the source code to the version control system
     * @param version - The version to push the source code to
     * @param sourceCode - The source code to push to the version control system
     */
    push(version: Version, sourceCode: SourceCode): Promise<void>

    /**
     * Pulls the source code from the version control system
     * @param version - The version to pull the source code from
     * @returns The source code for the given version
     */
    pull(version: Version): Promise<SourceCode>

}