import { CreateTask } from "@domain/use-cases/task/create-task"
import { Task } from "@domain/entities/task"
import { TaskRepository } from "@domain/repositories/task-repository"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { Project } from "@domain/entities/project"
import { ProjectDetails } from "@domain/types/project-details"
import { Workflow } from "@domain/workflow/workflow"
export class CreateTaskUseCase implements CreateTask {
	constructor(
		private readonly taskRepository: TaskRepository,
		private readonly projectRepository: ProjectRepository,
		private readonly projectRefiningWorkflow: Workflow
	) {}

	async execute(projectId: string, title: string, description: string): Promise<Task> {
		try {
			// Create a new task
			const task: Task = Task.create('User', projectId, title, description)

			// Refine project details
			const project: Project = await this.projectRepository.findById(projectId)
			if (!project) {
				throw new Error("Project not found")
			}

			if (!project.detailsUpdated) {
				const accountId = "User"
				const projectDetails: ProjectDetails = await this.projectRefiningWorkflow.run(task, accountId)
				project.updateDetails(projectDetails.name, projectDetails.description)
				await this.projectRepository.save(project)
			}
			// Persist the task in the database
			const savedTask = await this.taskRepository.save(task)
			
			return savedTask
		} catch (error) {
			console.error("Error creating new task:", error)
			throw new Error("Failed to create new task.")
		}
	}
}
