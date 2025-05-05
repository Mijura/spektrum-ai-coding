import { CreateIssue } from "@domain/use-cases/issue/create-issue"
import { Issue } from "@domain/entities/issue"
import { IssueRepository } from "@domain/repositories/issue-repository"
import { Workflow } from "@domain/entities/workflow/workflow"

export class CreateIssueUseCase implements CreateIssue {
	constructor(
		private readonly issueRepository: IssueRepository,
		private readonly issueRefiningWorkflow: Workflow	
	) {}

	async execute(projectId: string, title: string, description: string): Promise<Issue> {
		try {
			// Create a new issue
			const issue: Issue = Issue.create('User', projectId, title, description)
			const refinedIssue = await this.issueRefiningWorkflow.run(issue)

			// Persist the issue in the database
			const savedIssue = await this.issueRepository.save(refinedIssue)
			
			return savedIssue
		} catch (error) {
			console.error("Error creating new issue:", error)
			throw new Error("Failed to create new issue.")
		}
	}
}
