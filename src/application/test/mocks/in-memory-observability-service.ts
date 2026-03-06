import { ObservabilityService } from "@app/ports/services/observability-service"
import { TaskExecution, TaskExecutionStatus } from "@app/types/task-execution"

export class InMemoryObservabilityService implements ObservabilityService {
	private byTaskExecutionId: Map<string, TaskExecution> = new Map()
	private defaultTaskExecution: TaskExecution = {
		id: "default-task-execution-id",
		title: "Default Task",
		projectId: "default-project-id",
		taskId: "default-task-id",
		accountId: "default-account-id",
		status: TaskExecutionStatus.RUNNING,
		occurredAt: new Date().toISOString(),
	}

	/**
	 * Provide deterministic output for a specific taskExecutionId.
	 */
	seed(taskExecutionId: string, taskExecution: TaskExecution) {
		this.byTaskExecutionId.set(taskExecutionId, taskExecution)
	}

	/**
	 * Provide fallback output when no task-execution-specific value is seeded.
	 */
	setDefault(taskExecution: TaskExecution) {
		this.defaultTaskExecution = taskExecution
	}

	async taskExecutionStarted(
		taskTitle: string,
		taskProjectId: string,
		taskExecutionId: string,
		accountId: string,
	): Promise<TaskExecution> {
		const seeded = this.byTaskExecutionId.get(taskExecutionId)
		if (seeded) {
			return seeded
		}

		const taskExecution: TaskExecution = {
			...this.defaultTaskExecution,
			id: taskExecutionId,
			title: taskTitle,
			projectId: taskProjectId,
			taskId: taskExecutionId,
			accountId: accountId,
			status: TaskExecutionStatus.RUNNING,
			occurredAt: new Date().toISOString(),
		}
		this.byTaskExecutionId.set(taskExecutionId, taskExecution)
		return taskExecution
	}

	async taskExecutionSucceeded(taskExecutionId: string): Promise<void> {
		const taskExecution = this.byTaskExecutionId.get(taskExecutionId)
		if (taskExecution) {
			taskExecution.status = TaskExecutionStatus.SUCCEEDED
		}
	}

	async taskExecutionFailed(taskExecutionId: string, errorMessage: string): Promise<void> {
		const taskExecution = this.byTaskExecutionId.get(taskExecutionId)
		if (taskExecution) {
			taskExecution.status = TaskExecutionStatus.FAILED
			taskExecution.error = errorMessage
		}
	}

	/**
	 * Get task execution by ID (for testing purposes).
	 */
	getTaskExecution(taskExecutionId: string): TaskExecution | undefined {
		return this.byTaskExecutionId.get(taskExecutionId)
	}
}
