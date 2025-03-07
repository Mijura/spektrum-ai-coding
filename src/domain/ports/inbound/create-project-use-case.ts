import { ProjectDetails } from "@domain/entities/project-details"

export interface CreateProjectUseCase {
    execute(): Promise<ProjectDetails>
}
