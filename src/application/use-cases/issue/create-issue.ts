import { CreateIssue } from "@domain/use-cases/issue/create-issue"
import { Issue } from "@domain/entities/issue"
import { IssueRepository } from "@domain/repositories/issue-repository"

export class CreateIssueUseCase implements CreateIssue {
	constructor(
		private readonly issueRepository: IssueRepository
	) {}

	async execute(projectId: string, title: string, description: string): Promise<Issue> {
		try {
			// Create a new issue
			const issue: Issue = Issue.create(projectId, title, description)


			// TODO: Get the user id from the request
			// TODO: Save activity
			// Persist the issue in the database
			return await this.issueRepository.save(issue)
		} catch (error) {
			console.error("Error creating new issue:", error)
			throw new Error("Failed to create new issue.")
		}
	}
}
