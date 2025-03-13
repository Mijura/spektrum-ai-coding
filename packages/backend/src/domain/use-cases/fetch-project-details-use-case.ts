import { Project } from "@domain/model/project"

export interface FetchProjectUseCase {
    execute(projectId: string): Promise<Project | null> 
}

