import { Project } from "@domain/entities/project-details"

export interface ProjectStorage {
	save(project: Project): Promise<void>
	findById(id: string): Promise<Project | null>
}
