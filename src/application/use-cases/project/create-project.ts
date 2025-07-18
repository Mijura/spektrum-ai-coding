import { Project } from "@domain/entities/project"
import { CreateProject } from "@domain/use-cases/project/create-project"
import { ProjectRepository } from "@domain/ports/repositories/project-repository"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { Version } from "@domain/value-objects/version"
import { Template } from "@domain/ports/templates/template"
import { WebHostingService } from "@domain/ports/services/web-hosting-service"
import { VersionControlSystem } from "@domain/ports/version-control-system"
import { VersionRepository } from "@domain/ports/repositories/version-repository"
import { Commit } from "@domain/value-objects/commit"

export class CreateProjectUseCase implements CreateProject {
	constructor(
		private readonly projectRepository: ProjectRepository,
		private readonly template: Template,
		private readonly webHostingService: WebHostingService,
		private readonly versionControlSystem: VersionControlSystem,
		private readonly versionRepository: VersionRepository
	) {}

	async execute(owner: string): Promise<Project> {
		try {
			// Create a new project with a unique ID
			const project: Project = Project.create("My Project", "Empty project...", owner)

			// Deploy the prebuilt files
			const buildArtifact: FileArtifacts = await this.template.fetchPrebuiltFiles()
			const sourceCode: FileArtifacts = await this.template.fetchSourceCode()

			const commit: Commit = { buildArtifact, sourceCode }
			
			await this.webHostingService.deployPrebuiltCode(buildArtifact)
			
			console.log('Template deployed successfully!')
			
			// Save the version
			const version = Version.create(project.id)
			await this.versionControlSystem.commitVersion(project.id, commit)
			await this.versionRepository.save(version)
			
			// Persist the project details in the database
			await this.projectRepository.save(project)

			return project
		} catch (error) {
			console.error("Error creating new project:", error)
			throw new Error("Failed to create new project.")
		}
	}
}
