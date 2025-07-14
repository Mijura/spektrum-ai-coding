import { Task } from "@domain/entities/task"

export interface TaskRepository {
	save(task: Task): Promise<Task>
	get(taskId: string): Promise<Task | null>
	getAll(projectId: string): Promise<Task[]>
}
