import { Task } from "@domain/entities/task"
import { FileArtifacts } from "@jigjoy-io/project-artifacts-client"

export interface WorkUnit {
    task: Task
    sourceCode: FileArtifacts
    buildArtifact: FileArtifacts | null
}