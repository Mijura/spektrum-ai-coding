import { CreateTask } from "@domain/use-cases/task/create-task"
import { Task } from "@domain/entities/task"
import { TaskRepository } from "@domain/repositories/task-repository"
import { ProjectService } from "@domain/services/project-service"
export class CreateTaskUseCase implements CreateTask {
	constructor(
		private readonly taskRepository: TaskRepository,
		private readonly projectService: ProjectService
	) {}

	async execute(projectId: string, title: string, description: string): Promise<Task> {
		try {
			// Create a new task
			const task: Task = Task.create('User', projectId, title, description)

			this.projectService.updateDetailsWithAI(task)
			// Persist the task in the database
			const savedTask = await this.taskRepository.save(task)
			
			return savedTask
		} catch (error) {
			console.error("Error creating new task:", error)
			throw new Error("Failed to create new task.")
		}
	}
}
