import { ProjectStorage } from "@domain/persistence/project-storage"
import { Project } from "@domain/entities/project"
import { ArchiveProjectUseCase } from "@domain/use-cases/archive-project-use-case"

export class ArchiveProject implements ArchiveProjectUseCase {
	constructor(private readonly projectStorage: ProjectStorage) {}

	async execute(projectId: string): Promise<Project> {
		const project = await this.projectStorage.findById(projectId)
		project.archive()
		return await this.projectStorage.save(project)
	}
}
