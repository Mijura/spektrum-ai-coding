import { Project } from "@domain/entities/project"
import { RunPrototypingWorkflow } from "@domain/use-cases/workflow/run-workflow"
import { PrototypingWorkflow } from "@infrastructure/workflows/prototyping"
import { IssueRepository } from "@domain/repositories/issue-repository"
import { ProjectRepository } from "@domain/repositories/project-repository"

export class RunPrototypingWorkflowUseCase implements RunPrototypingWorkflow {

	constructor(
		private readonly issueRepository: IssueRepository,
		private readonly projectRepository: ProjectRepository,
		private readonly prototypingWorkflow: PrototypingWorkflow
	) {}

	async run(issueId: string): Promise<Project> {
		const issue = await this.issueRepository.findById(issueId)
		if (!issue) {
			throw new Error("Issue not found")
		}
		const project = await this.projectRepository.findById(issue.projectId)
		if (!project) {
			throw new Error("Project not found")
		}
		return await this.prototypingWorkflow.run(project, issue)
	}
}
