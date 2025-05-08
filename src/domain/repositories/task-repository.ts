import { Task } from "@domain/entities/task"

export interface TaskRepository {
	save(task: Task): Promise<Task>
	findById(taskId: string): Promise<Task | null>
	findAll(projectId: string): Promise<Task[]>
}
