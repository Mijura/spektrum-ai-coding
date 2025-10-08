import { FileArtifacts } from "@jigjoy-io/file-artifacts"


export interface VersionControlSystem {

    /**
     * Creates a new repository
     * @returns The repository id created by the version control system
     */
    createRepository(): Promise<string>

    /**
     * Commits the files to the version control system
     * @param repositoryId - The repository id to commit the files to
     * @param fileArtifacts - The file artifacts to commit
     * @returns The version created by the version control system
     */
    commit(repositoryId: string, fileArtifacts: FileArtifacts): Promise<void>

    /**
     * Pulls the files from the version control system
     * @param repositoryId - The repository id to pull the files from
     * @returns The files for the given repository
     */
    pull(repositoryId: string): Promise<FileArtifacts>


}