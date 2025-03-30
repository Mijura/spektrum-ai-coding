
import { FetchProjectUseCase } from "@domain/use-cases/fetch-project-use-case"
import { ProjectStorage } from "@domain/persistence/project-storage"
import { Project } from "@domain/entities/project"

export class FetchProject implements FetchProjectUseCase {
	constructor(private readonly projectStorage: ProjectStorage) {}

	async execute(projectId: string): Promise<Project> {
		return await this.projectStorage.findById(projectId)
	}
}
