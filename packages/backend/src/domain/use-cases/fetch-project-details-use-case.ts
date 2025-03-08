import { ProjectDetails } from "@domain/model/project-details"

export interface FetchProjectDetailsUseCase {
    execute(projectId: string): Promise<ProjectDetails | null> 
}

