import { FileArtifacts } from "./file-artifacts"

export type Commit = {
    buildArtifact: FileArtifacts,
    sourceCode: FileArtifacts
}