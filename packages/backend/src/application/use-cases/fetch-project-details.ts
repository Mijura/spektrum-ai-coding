import { ProjectDetails } from "@domain/model/project-details"
import { FetchProjectDetailsUseCase } from "@domain/use-cases/fetch-project-details-use-case"
import { ProjectStorage } from "@domain/persistence/project-storage"

export class FetchProjectDetails implements FetchProjectDetailsUseCase {
	constructor(private readonly projectStorage: ProjectStorage) {}

	async execute(projectId: string): Promise<ProjectDetails | null> {
		return await this.projectStorage.findById(projectId)
	}
}
