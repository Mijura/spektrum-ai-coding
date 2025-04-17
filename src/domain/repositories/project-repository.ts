import { Project, ProjectStatus } from "@domain/entities/project"

export interface ProjectRepository {
	save(project: Project): Promise<Project>
	findById(id: string): Promise<Project>
	findAll(ownerId: string): Promise<Project[]>
	findAllByStatus(ownerId: string, status: ProjectStatus): Promise<Project[]>
}
