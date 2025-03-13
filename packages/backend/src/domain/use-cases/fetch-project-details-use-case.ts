import { Project } from "@domain/entities/project"

export interface FetchProjectUseCase {
    execute(projectId: string): Promise<Project> 
}

