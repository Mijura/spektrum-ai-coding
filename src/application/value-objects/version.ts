import { FileArtifacts } from "@domain/value-objects/file-artifacts"

export type Version = {
    repositoryId: string
    buildArtifacts:  FileArtifacts
    sourceCodeArtifacts: FileArtifacts
}