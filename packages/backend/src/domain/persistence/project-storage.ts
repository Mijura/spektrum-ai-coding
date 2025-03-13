import { Project } from "@domain/model/project"

export interface ProjectStorage {
	save(project: Project): Promise<Project>
	findById(id: string): Promise<Project | null>
}
