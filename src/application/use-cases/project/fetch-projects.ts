import { Project, ProjectStatus } from "@domain/entities/project"
import { FetchProjects } from "@domain/use-cases/project/fetch-projects"
import { ProjectRepository } from "@domain/repositories/project-repository"

export class FetchProjectsUseCase implements FetchProjects {
	constructor(private readonly projectStorage: ProjectRepository) {}

	async execute(ownerId: string): Promise<Project[]> {
		return await this.projectStorage.findAllByStatus(ownerId, ProjectStatus.ACTIVE)
	}
}
