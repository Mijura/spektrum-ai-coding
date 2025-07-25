import { Task } from "@domain/entities/task"
import { TaskRepository } from "@domain/ports/repositories/task-repository"
import { FetchTasks } from "@domain/use-cases/task/fetch-tasks"

export class FetchTasksUseCase implements FetchTasks {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(projectId: string): Promise<Task[]> {
		return await this.taskRepository.getAll(projectId)
	}
}
