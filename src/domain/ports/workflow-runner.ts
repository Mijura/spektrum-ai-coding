import { Task } from "@domain/entities/task"

export interface WorkflowRunner {
	run(task: Task, accountId?: string): Promise<any>
}
