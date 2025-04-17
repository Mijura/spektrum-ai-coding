
import { FetchProject } from "@domain/use-cases/project/fetch-project"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { Project } from "@domain/entities/project"

export class FetchProjectUseCase implements FetchProject {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(projectId: string): Promise<Project> {
		return await this.projectRepository.findById(projectId)
	}
}
