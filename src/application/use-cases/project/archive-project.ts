import { Project } from "@domain/entities/project"
import { ArchiveProject } from "@domain/use-cases/project/archive-project"
import { ProjectRepository } from "@domain/repositories/project-repository"

export class ArchiveProjectUseCase implements ArchiveProject {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(projectId: string): Promise<Project> {
		const project = await this.projectRepository.findById(projectId)
		project.archive()
		return await this.projectRepository.save(project)
	}
}
