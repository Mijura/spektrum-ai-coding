import { ProjectDetails } from "@domain/entities/project-details"
import { FetchProjectDetailsUseCase } from "@domain/ports/inbound/fetch-project-details-use-case"
import { ProjectStorage } from "@domain/ports/outbound/project-storage"

export class FetchProjectDetails implements FetchProjectDetailsUseCase {
	constructor(private readonly projectStorage: ProjectStorage) {}

	async execute(projectId: string): Promise<ProjectDetails | null> {
		return await this.projectStorage.findById(projectId)
	}
}
