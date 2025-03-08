import { ProjectDetails } from "@domain/model/project-details"

export interface ProjectStorage {
	save(project: ProjectDetails): Promise<ProjectDetails>
	findById(id: string): Promise<ProjectDetails | null>
}
