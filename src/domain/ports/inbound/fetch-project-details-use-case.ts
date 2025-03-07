import { ProjectDetails } from "@domain/entities/project-details"

export interface FetchProjectDetailsUseCase {
    execute(projectId: string): Promise<ProjectDetails | null> 
}

