import { Project } from "@domain/entities/project"

export interface FetchAllProjectsUseCase {
    execute(ownerId: string): Promise<Project[]> 
}

