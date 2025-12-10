import { FileArtifacts } from "./file-artifacts"

export interface WorkUnit {
    task: string
    sourceCode: FileArtifacts
    buildArtifacts: FileArtifacts
}