import { Task } from "@domain/entities/task"

export interface WorkflowPort {
	run(task: Task, accountId?: string): Promise<any>
}
