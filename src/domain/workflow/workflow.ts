import { Task } from "@domain/entities/task"

export interface Workflow {
	run(task: Task, accountId?: string): Promise<any>
}
