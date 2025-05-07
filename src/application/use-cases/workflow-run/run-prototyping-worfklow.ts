import { RunPrototypingWorkflow } from "@domain/use-cases/workflow/run-workflow"
import { PrototypingWorkflow } from "@infrastructure/workflows/prototyping/main"
import { IssueRepository } from "@domain/repositories/issue-repository"
import { WorkflowRunRepository } from "@domain/repositories/workflow-run-repository"

export class RunPrototypingWorkflowUseCase implements RunPrototypingWorkflow {

	constructor(
		private readonly issueRepository: IssueRepository,
		private readonly prototypingWorkflow: PrototypingWorkflow
	) {}

	async run(issueId: string): Promise<void> {
		const issue = await this.issueRepository.findById(issueId)
		if (!issue) {
			throw new Error("Issue not found")
		}

		await this.prototypingWorkflow.run(issue)
		
	}
}
