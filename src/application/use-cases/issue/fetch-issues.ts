import { Issue } from "@domain/entities/issue"
import { IssueRepository } from "@domain/repositories/issue-repository"
import { FetchIssues } from "@domain/use-cases/issue/fetch-issues"

export class FetchIssuesUseCase implements FetchIssues {
	constructor(private readonly issueRepository: IssueRepository) {}

	async execute(projectId: string): Promise<Issue[]> {
		return await this.issueRepository.findAll(projectId)
	}
}
