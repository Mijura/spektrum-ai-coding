import { ProjectDetails } from "@domain/model/project-details"

export interface DeployProjectUseCase {
    execute(projectId: string): Promise<ProjectDetails>
}
