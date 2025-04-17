import { Project } from "@domain/entities/project"

export interface RunWorkflow {
	run(workflowId: string, projectId: string, message: string): Promise<Project>
}
