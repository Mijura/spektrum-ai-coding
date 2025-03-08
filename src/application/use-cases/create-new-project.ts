import { ProjectDetails } from "@domain/model/project-details"
import { ProjectStorage } from "@domain/persistence/project-storage"
import { FrontendDevelopmentService } from "@application/services/fronted-development"
import { v4 as uuidv4 } from "uuid"
import { CreateProjectUseCase } from "@domain/use-cases/create-project-use-case"

export class CreateNewProject implements CreateProjectUseCase {
	constructor(
		private readonly frontendDevelopmentService: FrontendDevelopmentService,
		private readonly projectStorage: ProjectStorage
	) {}

	async execute(): Promise<ProjectDetails> {
		try {
			// Create a new project with a unique ID
			const project = new ProjectDetails(uuidv4())

			// Initialize and run project
			await this.frontendDevelopmentService.setupProject(project.id)

			// Persist the project details in the database
			await this.projectStorage.save(project)

			return project
		} catch (error) {
			console.error("Error creating new project:", error)
			throw new Error("Failed to create new project.")
		}
	}
}
