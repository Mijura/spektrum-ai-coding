import { Project } from "@domain/entities/project"

export interface DevelopUserRequestUseCase {
	execute(projectId: string, message: string): Promise<Project>
}
