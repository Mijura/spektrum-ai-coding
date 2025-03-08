import { ProjectDetails } from "@domain/model/project-details"

export interface CreateProjectUseCase {
    execute(): Promise<ProjectDetails>
}
