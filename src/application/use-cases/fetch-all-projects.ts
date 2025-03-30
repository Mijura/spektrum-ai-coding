import { ProjectStorage } from "@domain/persistence/project-storage"
import { Project } from "@domain/entities/project"
import { FetchAllProjectsUseCase } from "@domain/use-cases/fetch-all-projects-use-case"

export class FetchAllProjects implements FetchAllProjectsUseCase {
	constructor(private readonly projectStorage: ProjectStorage) {}

	async execute(ownerId: string): Promise<Project[]> {
		return await this.projectStorage.findAll(ownerId)
	}
}
