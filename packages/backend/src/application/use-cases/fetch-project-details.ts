import { Project } from "@domain/entities/project"
import { FetchProjectUseCase } from "@domain/use-cases/fetch-project-details-use-case"
import { ProjectStorage } from "@domain/persistence/project-storage"

export class FetchProject implements FetchProjectUseCase {
	constructor(private readonly projectStorage: ProjectStorage) {}

	async execute(projectId: string): Promise<Project | null> {
		return await this.projectStorage.findById(projectId)
	}
}
