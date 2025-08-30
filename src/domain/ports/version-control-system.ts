import { Version } from "@domain/value-objects/version"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"

export interface VersionControlSystem {

    /**
     * Commits the source code and build artifact to the version control system
     * @param projectId - The project id to commit the source code and build artifact to
     * @param sourceCode - The source code to commit
     * @param buildArtifact - The build artifact to commit
     * @returns The version created by the version control system
     */
    commitVersion(projectId: string, sourceCode: FileArtifacts, buildArtifact: FileArtifacts): Promise<Version>

    /**
     * Pulls the source code from the version control system
     * @param versionId - The version id to pull the source code from
     * @returns The source code for the given version
     */
    pullSourceCode(versionId: string): Promise<FileArtifacts>

    /**
     * Pulls the build artifact from the version control system
     * @param versionId - The version id to pull the build artifact from
     * @returns The build artifact for the given version
     */
    pullBuildArtifact(versionId: string): Promise<FileArtifacts>

}