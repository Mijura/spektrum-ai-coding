import { Project } from "@domain/entities/project"
import { ProjectStorage } from "@domain/persistence/project-storage"
import { FrontendDevelopmentService } from "@application/services/fronted-development"
import { CreateProjectUseCase } from "@domain/use-cases/create-project-use-case"

export class CreateNewProject implements CreateProjectUseCase {
	constructor(
		private readonly frontendDevelopmentService: FrontendDevelopmentService,
		private readonly projectStorage: ProjectStorage
	) {}

	async execute(): Promise<Project> {
		try {
			// Create a new project with a unique ID
			const project: Project = Project.create("My Project", "Empty project...", undefined)

			// Initialize and run project
			await this.frontendDevelopmentService.setupProject(project.id)

			// Persist the project details in the database

			return await this.projectStorage.save(project)
		} catch (error) {
			console.error("Error creating new project:", error)
			throw new Error("Failed to create new project.")
		}
	}
}
