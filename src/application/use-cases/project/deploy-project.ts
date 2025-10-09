import { DeployProject } from "@domain/use-cases/project/deploy-project"
import { Project } from "@domain/entities/project"
import { ProjectRepository } from "@domain/ports/repositories/project-repository"
import { VersionControlSystem } from "@domain/ports/version-control-system"

export class DeployProjectUseCase implements DeployProject {
	constructor(
		private readonly projectRepository: ProjectRepository,
		private readonly versionControlSystem: VersionControlSystem
	) {}

	async execute(projectId: string): Promise<Project> {

		try {
			
			const project = await this.projectRepository.get(projectId)


			console.log(`Deploying project ${JSON.stringify(project)}`)
	
			//const sourceCode = await this.versionControlSystem.pull(project.repositoryId)
	
			//const url = await this.webHostingService.deployPrebuiltCode(project.id, sourceCode)
	 

			//const version = await this.versionControlSystem.commit(project.repositoryId, commit)
			
			return project
		} catch (error) {
	
			throw new Error(`Deployment failed: ${error}`)
		}
	}
}
