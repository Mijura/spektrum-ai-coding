import { Project } from "@domain/entities/project"
import { ProjectRepository } from "@domain/ports/repositories/project-repository"
import { UpdateProjectDetails } from "@domain/use-cases/project/update-details"

export class UpdateProjectDetailsUseCase implements UpdateProjectDetails {
    constructor(
        private readonly projectRepository: ProjectRepository
    ) {}

    async execute(projectId: string, name: string, description: string): Promise<Project> {
        try {
            
            console.log(`Updating project details for project ${projectId}`)
            const project: Project | null = await this.projectRepository.get(projectId)

            if (!project) {
                throw new Error("Project not found.")
            }

            // Update project details
            project.setName(name)
            project.setDescription(description)

            // Persist the project in the database
            return await this.projectRepository.save(project)
        } catch (error) {
            console.error("Error during project details update:", error)
            throw new Error("Failed to update project details.")
        }
    }
} 