import { Task } from "@domain/entities/task"
import { FileArtifacts } from "./file-artifacts"

export interface WorkUnit {
    task: Task
    sourceCode: FileArtifacts
}