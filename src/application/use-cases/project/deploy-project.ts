import { DeployProject } from "@domain/use-cases/project/deploy-project"
import { Project } from "@domain/entities/project"
import { ProjectRepository } from "@domain/ports/repositories/project-repository"
import { VersionControlSystem } from "@domain/ports/version-control-system"
import { WebHostingService } from "@domain/ports/services/web-hosting-service"
import { Commit } from "@domain/value-objects/commit"

export class DeployProjectUseCase implements DeployProject {
	constructor(
		private readonly projectRepository: ProjectRepository,
		private readonly versionControlSystem: VersionControlSystem,
		private readonly webHostingService: WebHostingService
	) {}

	async execute(projectId: string): Promise<Project> {

		try {
			
			const project = await this.projectRepository.get(projectId)

			const latestVersion = project.latestDevDeployment?.version
			if(!latestVersion) {
				throw new Error("Dev environment not found")
			}
	
			const buildArtifact = await this.versionControlSystem.pullBuildArtifact(latestVersion)
			const sourceCode = await this.versionControlSystem.pullSourceCode(latestVersion)
	

			console.log(JSON.stringify(latestVersion))
	
			const url = await this.webHostingService.deployPrebuiltCode(projectId, buildArtifact)
	
			const commit: Commit = { buildArtifact, sourceCode }
			const version = await this.versionControlSystem.commitVersion(projectId, commit)
			project.setLatestProdDeployment({url , version})
			
			await this.projectRepository.save(project)
			return project
		} catch (error) {
	
			throw new Error(`Deployment failed: ${error}`)
		}
	}
}
