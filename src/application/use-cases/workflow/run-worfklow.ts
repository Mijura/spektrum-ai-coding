import { Project } from "@domain/entities/project"
import { RunWorkflow } from "@domain/use-cases/workflow/run-workflow"
import { Workflow } from "@domain/entities/workflow"
import EventEmitter from "events"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { IssueRepository } from "@domain/repositories/issue-repository"
import { WorkflowFactory } from "@infrastructure/workflows/prototyping/interfaces/workflow-factory"

export class RunWorkflowUseCase extends EventEmitter implements RunWorkflow {

	private readonly workflow: Workflow

	constructor(
		private readonly workflowId: string,
		private readonly projectRepository: ProjectRepository,
		private readonly issueRepository: IssueRepository
	) {
		super()

		this.workflow = WorkflowFactory.create(this.workflowId)
		// listeners are placed in the constructor so they are attached once
		this.workflow.on("update", (data: any) => {
			this.emit("update", data)
		})

		this.workflow.on("done", (data: any) => {
			this.emit("done", data)
		})
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
