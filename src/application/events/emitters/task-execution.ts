import { TaskExecution } from "@jigjoy-io/observability-client"
import { eventBus } from "@application/events/event-bus"

export class TaskExecutionEmitter {
	static newTaskExecution(taskExecution: TaskExecution): void {
		eventBus.emit("task-execution:new", taskExecution)
	}

	static taskExecutionUpdated(taskExecution: TaskExecution): void {
		eventBus.emit("task-execution:update", taskExecution)
	}
}
