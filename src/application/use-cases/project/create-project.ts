import { Project } from "@domain/entities/project"
import { CreateProject } from "@domain/use-cases/project/create-project"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { FrontendDevelopmentService } from "@domain/services/frontend-development"

export class CreateProjectUseCase implements CreateProject {
	constructor(
		private readonly frontendDevelopmentService: FrontendDevelopmentService,
		private readonly projectRepository: ProjectRepository
	) {}

	async execute(owner: string): Promise<Project> {
		try {
			// Create a new project with a unique ID
			const project: Project = Project.create("My Project", "Empty project...", owner)

			// Initialize and run project
			await this.frontendDevelopmentService.setupProject(project.id)

			// Persist the project details in the database
			return await this.projectRepository.save(project)
		} catch (error) {
			console.error("Error creating new project:", error)
			throw new Error("Failed to create new project.")
		}
	}
}
