import { Project } from "@domain/entities/project"
import { CreateProject } from "@domain/use-cases/project/create-project"
import { ProjectRepository } from "@domain/ports/repositories/project-repository"
import { FileArtifacts } from "@honeycomb-app/file-artifacts"
import { Template } from "@domain/ports/templates/template"
import { WebHostingService } from "@domain/ports/services/web-hosting-service"
import { VersionControlSystem } from "@domain/ports/version-control-system"
import { Deployment } from "@domain/entities/project"

export class CreateProjectUseCase implements CreateProject {
	constructor(
		private readonly projectRepository: ProjectRepository,
		private readonly template: Template,
		private readonly webHostingService: WebHostingService,
		private readonly versionControlSystem: VersionControlSystem
	) {}

	async execute(owner: string): Promise<Project> {
		try {
			// Create a new project with a unique ID
			const project: Project = Project.create("My Project", "Empty project...", owner)
			const repositoryId: string = await this.versionControlSystem.createRepository()

			const buildArtifact: FileArtifacts = await this.template.fetchPrebuiltFiles()
			const sourceCode: FileArtifacts = await this.template.fetchSourceCode()

			// save version
			await this.versionControlSystem.commit(repositoryId, sourceCode)

			// deploy files
			const url: string = await this.webHostingService.deployPrebuiltCode(project.devEnvironmentId, buildArtifact)

			console.log('Template deployed successfully!')

			const deployment : Deployment = { url, version }
			
			project.setLatestDevDeployment(deployment)
			await this.projectRepository.save(project)

			return project
		} catch (error) {
			console.error("Error creating new project:", error)
			throw new Error("Failed to create new project.")
		}
	}
}
