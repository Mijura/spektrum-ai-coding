import { Project } from "@domain/entities/project"
import { ProjectUseCase } from "@domain/ports/inbound/project-use-case"
import { ProjectRepository } from "@domain/ports/outbound/project-repository"

export class FetchProjectDetails implements ProjectUseCase<string, Project | null> {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(projectId: string): Promise<Project | null> {
		return await this.projectRepository.findById(projectId)
	}
}
