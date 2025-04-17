import { Project } from "@domain/entities/project"

export interface FetchProject {
    execute(projectId: string): Promise<Project> 
}

