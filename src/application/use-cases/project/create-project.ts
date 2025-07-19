import { Project } from "@domain/entities/project"
import { CreateProject } from "@domain/use-cases/project/create-project"
import { ProjectRepository } from "@domain/ports/repositories/project-repository"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { Template } from "@domain/ports/templates/template"
import { WebHostingService } from "@domain/ports/services/web-hosting-service"
import { VersionControlSystem } from "@domain/ports/version-control-system"
import { Commit } from "@domain/value-objects/commit"

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

			// 
			const buildArtifact: FileArtifacts = await this.template.fetchPrebuiltFiles()
			const sourceCode: FileArtifacts = await this.template.fetchSourceCode()

			// save version
			const commit: Commit = { buildArtifact, sourceCode }
			await this.versionControlSystem.commitVersion(project.id, commit)

			// deploy files
			await this.webHostingService.deployPrebuiltCode(buildArtifact)
			console.log('Template deployed successfully!')
			
			// TODO: update dev environment url and version
			await this.projectRepository.save(project)

			return project
		} catch (error) {
			console.error("Error creating new project:", error)
			throw new Error("Failed to create new project.")
		}
	}
}
