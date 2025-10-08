import { Task } from "@domain/entities/task"
import { FileArtifacts } from "@jigjoy-io/file-artifacts"

export interface WorkUnit {
    task: Task
    sourceCode: FileArtifacts
    buildArtifact: FileArtifacts | null
}