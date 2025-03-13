import { Project } from "@domain/entities/project"

export interface DeployProjectUseCase {
    execute(projectId: string): Promise<Project>
}
