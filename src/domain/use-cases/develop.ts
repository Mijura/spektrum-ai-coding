import { Task } from "@domain/entities/task"

export interface Develop {
	execute(task: Task, projectHistoryId: string): Promise<void>
}
