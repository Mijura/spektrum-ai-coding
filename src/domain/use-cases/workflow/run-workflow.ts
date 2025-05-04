import { Project } from "@domain/entities/project"

export interface RunPrototypingWorkflow {
	run(issueId: string): Promise<Project>
}
