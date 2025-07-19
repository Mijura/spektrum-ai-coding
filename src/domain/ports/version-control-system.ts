import { Version } from "@domain/value-objects/version"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { Commit } from "@domain/value-objects/commit"

export interface VersionControlSystem {


    commitVersion(projectId: string, commit: Commit): Promise<Version>

    /**
     * Pulls the source code from the version control system
     * @param version - The version to pull the source code from
     * @returns The source code for the given version
     */
    pullSourceCode(version: Version): Promise<FileArtifacts>

    /**
     * 
     * @param version 
     */
    pullBuildArtifact(version: Version): Promise<FileArtifacts>

}