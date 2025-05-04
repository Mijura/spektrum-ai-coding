import { Issue } from "@domain/entities/issue"
import { IssueDto } from "@application/dto/issue"
import { IssueRepository } from "@domain/repositories/issue-repository"
import { UpdateIssueDescription } from "@domain/use-cases/issue/update-description"

export class UpdateIssueDescriptionUseCase implements UpdateIssueDescription{
	constructor(
		private readonly issueRepository: IssueRepository
	) {}

	async execute(issueDto: IssueDto): Promise<Issue> {
		try {
			// fetch the old issue and update it
			console.log(`Updating issue description for issue ${issueDto.id} to ${issueDto.description}.`)
            const issue: Issue | null = await this.issueRepository.findById(issueDto.id)

            if (!issue) {
                throw new Error("Issue not found.")
            }

			// TODO: Get the user id from the context
            issue.updateDescription("User", issueDto.description)


			// Persist the issue in the database
			return await this.issueRepository.save(issue)
		} catch (error) {
			console.error("Error during issue description update:", error)
			throw new Error("Failed to edit issue description.")
		}
	}
}
