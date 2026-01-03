import { FileArtifacts } from "@application/value-objects/file-artifacts"

export type Version = {
    repositoryId: string
    buildArtifacts:  FileArtifacts
    sourceCodeArtifacts: FileArtifacts
}