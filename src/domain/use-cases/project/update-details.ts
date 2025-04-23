import { Project } from "@domain/entities/project"

export interface UpdateProjectDetails {
    execute(projectId: string, name: string, description: string): Promise<Project>
} 