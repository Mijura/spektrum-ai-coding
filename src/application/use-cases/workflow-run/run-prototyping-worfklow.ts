import { RunPrototypingWorkflow } from "@domain/use-cases/workflow/run-workflow"
import { PrototypingWorkflow } from "@infrastructure/workflows/prototyping/main"
import { IssueRepository } from "@domain/repositories/issue-repository"
import { WorkflowRun } from "@domain/entities/workflow/workflow-run"
import { WorkflowRunRepository } from "@domain/repositories/workflow-run-repository"

export class RunPrototypingWorkflowUseCase implements RunPrototypingWorkflow {

	constructor(
		private readonly issueRepository: IssueRepository,
		private readonly workflowRunRepository: WorkflowRunRepository,
		private readonly prototypingWorkflow: PrototypingWorkflow
	) {}

	async run(issueId: string): Promise<void> {
		const issue = await this.issueRepository.findById(issueId)
		if (!issue) {
			throw new Error("Issue not found")
		}
		const workflowRun = WorkflowRun.create(issue, "Prototyping")
		const [savedWorkflowRun] = await Promise.all([
			this.workflowRunRepository.save(workflowRun),
			this.prototypingWorkflow.run(issue)
		])

		console.log(`Workflow run ${JSON.stringify(savedWorkflowRun)}`)
		
	}
}
