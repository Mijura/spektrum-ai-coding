import { Project } from "@domain/entities/project"

export interface FetchProjects {
    execute(ownerId: string): Promise<Project[]> 
}

