import { Project, ProjectStatus } from "@domain/entities/project"
import { FetchProjects } from "@domain/use-cases/project/fetch-projects"
import { ProjectRepository } from "@domain/ports/repositories/project-repository"

export class FetchProjectsUseCase implements FetchProjects {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(ownerId: string): Promise<Project[]> {
		return await this.projectRepository.getAllByStatus(ownerId, ProjectStatus.ACTIVE)
	}
}
