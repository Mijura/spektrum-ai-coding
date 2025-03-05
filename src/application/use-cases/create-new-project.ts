import { Project } from "@domain/entities/project"
import { ProjectUseCase } from "@domain/ports/inbound/project-use-case"
import { ProjectRepository } from "@domain/ports/outbound/project-repository"
import { ProjectService } from "@domain/services/project-service"
import { v4 as uuidv4 } from "uuid"

export class CreateNewProject implements ProjectUseCase<null, Project> {
	constructor(private readonly projectService: ProjectService, private readonly projectRepository: ProjectRepository) {}

	async execute(): Promise<Project> {
		try {
			// Create a new project with a unique ID
			const project = new Project(uuidv4())

			// Initialize and build project
			await this.projectService.setupProject(project.id)

			// Persist the project details in the database
			await this.projectRepository.save(project)

			return project
		} catch (error) {
			console.error("Error creating new project:", error)
			throw new Error("Failed to create new project.")
		}
	}
}
