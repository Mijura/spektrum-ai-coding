import { Project } from "@domain/entities/project"
import { RunWorkflow } from "@domain/use-cases/workflow/run-workflow"
import { Workflow } from "@domain/entities/workflow"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { IssueRepository } from "@domain/repositories/issue-repository"
import { WorkflowFactory } from "@infrastructure/workflows/prototyping/interfaces/workflow-factory"

export class RunWorkflowUseCase implements RunWorkflow {

	private readonly workflow: Workflow

	constructor(
		private readonly workflowId: string,
		private readonly projectRepository: ProjectRepository,
		private readonly issueRepository: IssueRepository
	) {
		this.workflow = WorkflowFactory.create(this.workflowId)
	}

	async run(projectId: string, issueId: string): Promise<Project> {
		const project = await this.projectRepository.findById(projectId)
		const issue = await this.issueRepository.findById(issueId)
		if (!project) {
			throw new Error("Project not found")
		}
		if (!issue) {
			throw new Error("Issue not found")
		}

		return await this.workflow.run(project, issue)
	}
}
