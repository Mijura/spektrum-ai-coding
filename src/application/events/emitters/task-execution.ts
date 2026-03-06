import { TaskExecution } from "@jigjoy-ai/observability-client"
import { eventBus } from "@app/events/event-bus"

export class TaskExecutionEmitter {
	static newTaskExecution(taskExecution: TaskExecution): void {
		eventBus.emit("task-execution:new", taskExecution)
	}

	static taskExecutionUpdated(taskExecution: TaskExecution): void {
		eventBus.emit("task-execution:update", taskExecution)
	}

	static taskExecutionCreditsSpent(accountId: string, amount: Number): void {
		eventBus.emit("task-execution:credits-spent", accountId, amount)
	}
}
