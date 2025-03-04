import { Project } from "@domain/entities/project"

export interface ProjectRepository {
	save(project: Project): Promise<void>
	findById(id: string): Promise<Project | null>
}
