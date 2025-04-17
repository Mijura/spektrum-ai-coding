import { Project } from "@domain/entities/project"

export interface DeployProject {
    execute(projectId: string): Promise<Project>
}
