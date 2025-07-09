import { Project, ProjectStatus } from "@domain/entities/project"

export interface ProjectRepository {
	save(project: Project): Promise<Project>
	get(projectId: string): Promise<Project>
	getAll(ownerId: string): Promise<Project[]>
	getAllByStatus(ownerId: string, status: ProjectStatus): Promise<Project[]>
}
