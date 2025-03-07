import { ProjectDetails } from "@domain/entities/project-details"

export interface DevelopUserRequestUseCase {
	execute(projectId: string, message: string): Promise<ProjectDetails>
}
