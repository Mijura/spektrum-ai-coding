import { Task } from "@domain/entities/task"
import { TaskDto } from "@application/dto/task"
import { TaskRepository } from "@domain/repositories/task-repository"
import { UpdateTaskDescription } from "@domain/use-cases/task/update-description"

export class UpdateTaskDescriptionUseCase implements UpdateTaskDescription{
	constructor(
		private readonly taskRepository: TaskRepository
	) {}

	async execute(taskDto: TaskDto): Promise<Task> {
		try {
			// fetch the old task and update it
			console.log(`Updating task description for task ${taskDto.id} to ${taskDto.description}.`)
            const task: Task | null = await this.taskRepository.findById(taskDto.id)

            if (!task) {
                throw new Error("Task not found.")
            }

			// TODO: Get the user id from the context
            task.updateDescription("User", taskDto.description)


			// Persist the task in the database
			return await this.taskRepository.save(task)
		} catch (error) {
			console.error("Error during task description update:", error)
			throw new Error("Failed to edit task description.")
		}
	}
}
