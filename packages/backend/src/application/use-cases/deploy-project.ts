import { ProjectStorage } from "@domain/persistence/project-storage"
import { FrontendDevelopmentService } from "@application/services/fronted-development"
import { DeployProjectUseCase } from "@domain/use-cases/deploy-project-use-case"

export class DeployProject implements DeployProjectUseCase {
	constructor(
		private readonly frontendDevelopmentService: FrontendDevelopmentService,
		private readonly projectStorage: ProjectStorage
	) {}

	async execute(projectId: string): Promise<void> {
		const project = await this.projectStorage.findById(projectId)

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
				await this.projectStorage.save(project)
			}
		} catch (error) {
	
			throw new Error(`Deployment failed: ${error}`)
		}
	}
}
