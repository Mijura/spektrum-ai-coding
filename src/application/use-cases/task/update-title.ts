import { Task } from "@domain/entities/task"
import { TaskDto } from "@application/dto/task"
import { TaskRepository } from "@domain/ports/repositories/task-repository"
import { UpdateTaskTitle } from "@domain/use-cases/task/update-title"

export class UpdateTaskTitleUseCase implements UpdateTaskTitle{
	constructor(
		private readonly taskRepository: TaskRepository
	) {}

	async execute(taskDto: TaskDto): Promise<Task> {
		try {
			// fetch the old task and update it
			console.log(`Updating task title for task ${taskDto.id} to ${taskDto.title}.`)
            const task: Task | null = await this.taskRepository.get(taskDto.id)

            if (!task) {
                throw new Error("Task not found.")
            }

			// TODO: Get the user id from the context
			task.updateTitle("User", taskDto.title)

			// Persist the task in the database
			return await this.taskRepository.save(task)
		} catch (error) {
			console.error("Error during task title update:", error)
			throw new Error("Failed to edit task title.")
		}
	}
}
