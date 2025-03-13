import { Project } from "@domain/entities/project"

export interface ProjectStorage {
	save(project: Project): Promise<Project>
	findById(id: string): Promise<Project | null>
}
