import { Issue } from "@domain/entities/issue"

export interface IssueRepository {
	save(issue: Issue): Promise<Issue>
	findById(issueId: string): Promise<Issue | null>
	findAll(projectId: string): Promise<Issue[]>
}
