
import { FileArtifacts } from "@jigjoy-io/project-artifacts-client"

export interface WorkUnit {
    task: string
    sourceCode: FileArtifacts
    buildArtifacts: FileArtifacts
}