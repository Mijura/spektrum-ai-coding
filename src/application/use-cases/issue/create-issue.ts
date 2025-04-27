import { CreateIssue } from "@domain/use-cases/issue/create-issue"
import { Issue } from "@domain/entities/issue"
import { IssueRepository } from "@domain/repositories/issue-repository"
import { IssueCreatedActivity } from "@domain/entities/activities/issue-created"
import { ActivityRepository } from "@domain/repositories/activity-repository"

export class CreateIssueUseCase implements CreateIssue {
	constructor(
		private readonly issueRepository: IssueRepository,
		private readonly activityRepository: ActivityRepository
	) {}

	async execute(projectId: string, title: string, description: string): Promise<Issue> {
		try {
			// Create a new issue
			const issue: Issue = Issue.create(projectId, title, description)

			// Persist the issue in the database
			const savedIssue = await this.issueRepository.save(issue)

			// TODO: Get actorId from request
			const activity: IssueCreatedActivity = IssueCreatedActivity.create('User', savedIssue)
			await this.activityRepository.save(activity)
			
			return savedIssue
		} catch (error) {
			console.error("Error creating new issue:", error)
			throw new Error("Failed to create new issue.")
		}
	}
}
