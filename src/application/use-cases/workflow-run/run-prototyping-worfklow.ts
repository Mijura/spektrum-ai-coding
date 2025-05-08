
import { PrototypingWorkflow } from "@infrastructure/workflows/prototyping/main"
import { IssueRepository } from "@domain/repositories/issue-repository"
import { RunPrototypingWorkflow } from "@domain/use-cases/workflow-run/run-prototyping-workflow"

export class RunPrototypingWorkflowUseCase implements RunPrototypingWorkflow {

	constructor(
		private readonly issueRepository: IssueRepository,
		private readonly prototypingWorkflow: PrototypingWorkflow
	) {}

	async run(issueId: string, accountId: string): Promise<void> {
		console.log("Running prototyping workflow for issue:", issueId, "and account:", accountId)
		const issue = await this.issueRepository.findById(issueId)
		if (!issue) {
			throw new Error("Issue not found")
		}

		await this.prototypingWorkflow.run(issue, accountId)
		
	}
}
