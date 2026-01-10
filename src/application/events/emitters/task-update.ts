import { eventBus } from "@application/events/event-bus"
import { Task } from "@jigjoy-io/task-contracts"


export class TaskEmitter {

    static taskUpdated(task: Task): void {
      	eventBus.emit("task:update", task)
    }
}