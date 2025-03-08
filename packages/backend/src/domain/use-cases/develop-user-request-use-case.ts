import { ProjectDetails } from "@domain/model/project-details"

export interface DevelopUserRequestUseCase {
	execute(projectId: string, message: string): Promise<ProjectDetails>
}
