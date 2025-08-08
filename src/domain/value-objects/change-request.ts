import { Task } from "@domain/entities/task"
import { FileArtifacts } from "./file-artifacts"

export interface ChangeRequest {
    task: Task
    sourceCode: FileArtifacts
}