import { CodeGeneratorPort } from "@app/ports/services/code-generator"
import { FileArtifacts } from "@domain/file-artifacts"
import { Task } from "@jigjoy-ai/task-contracts"

export class InMemoryCodeGeneratorPort implements CodeGeneratorPort {
	private byTaskId: Map<string, { comment: string; sourceCode: FileArtifacts }> = new Map()

	private defaultResult: { comment: string; sourceCode: FileArtifacts } = {
		comment: "Default generated code",
		sourceCode: new FileArtifacts(),
	}

	/**
	 * Provide deterministic output for a specific taskId.
	 */
	seed(taskId: string, result: { comment: string; sourceCode: FileArtifacts }) {
		this.byTaskId.set(taskId, result)
	}

	/**
	 * Provide fallback output when no task-specific value is seeded.
	 */
	setDefault(result: { comment: string; sourceCode: FileArtifacts }) {
		this.defaultResult = result
	}

	async generateCode(
		task: Task,
		currentSourceCode: FileArtifacts,
	): Promise<{ comment: string; sourceCode: FileArtifacts }> {
		return this.byTaskId.get(task.id) ?? this.defaultResult
	}
}
