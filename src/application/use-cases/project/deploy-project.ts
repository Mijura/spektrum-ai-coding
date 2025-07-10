import { DeployProject } from "@domain/use-cases/project/deploy-project"
import { Project } from "@domain/entities/project"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { FrontendDevelopmentService } from "@domain/ports/frontend-development-service"

export class DeployProjectUseCase implements DeployProject {
	constructor(
		private readonly frontendDevelopmentService: FrontendDevelopmentService,
		private readonly projectRepository: ProjectRepository
	) {}

	async execute(projectId: string): Promise<Project> {
		const project = await this.projectRepository.get(projectId)

		if (!project) {
			throw new Error("Project not found")
		}

		// Assign a deployment ID if needed
		const wasUpdated = project.assignDeploymentId()

		try {
			// Attempt to deploy the project
			await this.frontendDevelopmentService.deployProject(project)

			// Only persist if a new deployment ID was assigned
			if (wasUpdated) {
				await this.projectRepository.save(project)
			}

			return project
		} catch (error) {
	
			throw new Error(`Deployment failed: ${error}`)
		}
	}
}
