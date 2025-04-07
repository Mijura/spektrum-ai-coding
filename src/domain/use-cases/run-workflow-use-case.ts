import { Project } from "@domain/entities/project"

export interface RunWorkflowUseCase {
	run(workflowId: string, projectId: string, message: string): Promise<Project>
}
