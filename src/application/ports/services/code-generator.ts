import { FileArtifacts } from "@domain/file-artifacts"
import { Task } from "@jigjoy-ai/task-contracts"

export interface CodeGeneratorPort {
	generateCode(task: Task, currentSourceCode: FileArtifacts): Promise<{ comment: string; sourceCode: FileArtifacts }>
}
