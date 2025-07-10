import { Project } from "@domain/entities/project"
import { CreateProject } from "@domain/use-cases/project/create-project"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { FrontendDevelopmentService } from "@domain/ports/frontend-development-service"

export class CreateProjectUseCase implements CreateProject {
	constructor(
		private readonly projectRepository: ProjectRepository,
		private readonly frontendDevelopmentService: FrontendDevelopmentService,
	) {}

	async execute(owner: string): Promise<Project> {
		try {
			// Create a new project with a unique ID
			const project: Project = Project.create("My Project", "Empty project...", owner)

			// Initialize and run project
			const sourceCode = await this.frontendDevelopmentService.setupProject(project)
			project.setArtifact(sourceCode)
			
			// Persist the project details in the database
			return await this.projectRepository.save(project)
		} catch (error) {
			console.error("Error creating new project:", error)
			throw new Error("Failed to create new project.")
		}
	}
}
