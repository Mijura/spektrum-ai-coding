import { VersionControlSystem } from "@domain/ports/version-control-system"
import { FileArtifacts } from "@jigjoy-io/file-artifacts"

export class InMemoryVersionControlSystem implements VersionControlSystem {
    createRepository(): Promise<string> {
        throw new Error("Method not implemented.")
    }
    commit(repositoryId: string, fileArtifacts: FileArtifacts): Promise<void> {
        throw new Error("Method not implemented.")
    }
    pull(repositoryId: string): Promise<FileArtifacts> {
        throw new Error("Method not implemented.")
    }

}