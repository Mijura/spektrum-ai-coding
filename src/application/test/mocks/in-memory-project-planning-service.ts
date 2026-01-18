import { ProjectPlanningService } from "@app/ports/services/project-planning-service"
import { Contribution } from "@app/types/contribution"
import { Task, TaskStatus } from "@jigjoy-io/task-contracts"

export class InMemoryProjectPlanningService implements ProjectPlanningService {
	private byTaskId: Map<string, Task> = new Map()
	private byCommentKey: Map<string, Task> = new Map()

	private defaultTask: Task = {
		id: "default-task-id",
		projectId: "default-project-id",
		title: "Default Task",
		description: "Default task description",
		status: TaskStatus.TODO,
		created: new Date().toISOString(),
		updated: new Date().toISOString(),
		activities: [],
	}

	/**
	 * Provide deterministic output for recordWork for a specific taskId.
	 */
	seedRecordWork(taskId: string, task: Task) {
		this.byTaskId.set(taskId, task)
	}

	/**
	 * Provide deterministic output for leaveComment for a specific taskId and comment combination.
	 */
	seedLeaveComment(taskId: string, comment: string, task: Task) {
		const key = `${taskId}:${comment}`
		this.byCommentKey.set(key, task)
	}

	/**
	 * Provide fallback output when no task-specific value is seeded.
	 */
	setDefault(task: Task) {
		this.defaultTask = task
	}

	async recordWork(contribution: Contribution): Promise<Task> {
		return this.byTaskId.get(contribution.taskId) ?? this.defaultTask
	}

	async leaveComment(taskId: string, comment: string, authorId: string): Promise<Task> {
		const key = `${taskId}:${comment}`
		return this.byCommentKey.get(key) ?? this.byTaskId.get(taskId) ?? this.defaultTask
	}
}
