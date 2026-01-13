import { FileArtifacts } from "@domain/file-artifacts"
import { Task } from "@jigjoy-io/task-contracts"

export interface CodeAssistServicePort {
	generateCode(task: Task, currentSourceCode: FileArtifacts): Promise<{ comment: string; sourceCode: FileArtifacts }>
}
