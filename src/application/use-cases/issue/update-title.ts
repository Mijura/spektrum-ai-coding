import { Issue } from "@domain/entities/issue"
import { IssueDto } from "@application/dto/issue"
import { IssueRepository } from "@domain/repositories/issue-repository"
import { UpdateIssueTitle } from "@domain/use-cases/issue/update-title"

export class UpdateIssueTitleUseCase implements UpdateIssueTitle{
	constructor(
		private readonly issueRepository: IssueRepository
	) {}

	async execute(issueDto: IssueDto): Promise<Issue> {
		try {
			// fetch the old issue and update it
			console.log(`Updating issue title for issue ${issueDto.id} to ${issueDto.title}.`)
            const issue: Issue | null = await this.issueRepository.findById(issueDto.id)

            if (!issue) {
                throw new Error("Issue not found.")
            }

            issue.updateTitle(issueDto.title)

			// TODO: Get the user id from the context
			// TODO: Save activity

			// Persist the issue in the database
			return await this.issueRepository.save(issue)
		} catch (error) {
			console.error("Error during issue title update:", error)
			throw new Error("Failed to edit issue title.")
		}
	}
}
