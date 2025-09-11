import { Task } from "@domain/entities/task"
import { FileArtifacts } from "@honeycomb-app/file-artifacts"

export interface WorkUnit {
    task: Task
    sourceCode: FileArtifacts
    buildArtifact: FileArtifacts | null
}