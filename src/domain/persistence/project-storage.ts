import { ProjectDetails } from "@domain/entities/project-details"

export interface ProjectStorage {
	save(project: ProjectDetails): Promise<ProjectDetails>
	findById(id: string): Promise<ProjectDetails | null>
}
