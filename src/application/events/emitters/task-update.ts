import { eventBus } from "@app/events/event-bus"
import { Task } from "@jigjoy-ai/task-contracts"

export class TaskEmitter {
	static taskUpdated(task: Task): void {
		eventBus.emit("task:update", task)
	}
}
