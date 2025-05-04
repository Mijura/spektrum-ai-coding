import { Issue } from "@domain/entities/issue"
import { IssueDto } from "@application/dto/issue"
export class IssueDtoMapper {


	/** Convert Issue entity → marshalled issue for storage/transfer */
	static toDto(issue: Issue): IssueDto {

		return {
			id: issue.id,
			projectId: issue.projectId,
			title: issue.title,
			description: issue.description,
			status: issue.status,
			created: issue.created,
			updated: issue.updated,
			activities: issue.getActivityLog().map(activity => {
                return {
                    id: activity.id,
                    type: activity.type,
                    projectId: activity.projectId,
                    issueId: activity.issueId,
                    userId: activity.userId,
                    metadata: activity.metadata,
                    occurredAt: activity.occurredAt,
                }
            })
		}
	}

	static toDtos(issues: Issue[]): IssueDto[] {
		let issueDtos: IssueDto[] = []
		for (const issue of issues) {
			issueDtos.push(this.toDto(issue))
		}
		return issueDtos
	}

	/** Convert marshalled issue (e.g., from DB) → Issue entity */
	static toDomain(data: IssueDto): Issue {

		return Issue.rehydrate({
			id: data.id, 
			created: data.created, 
			projectId: data.projectId, 
			title: data.title, 
			description: data.description, 
			status: data.status, 
			updated: data.updated,
			activities: data.activities
		})
	}

	static toDomains(items: IssueDto[]): Issue[] {
		let issues: Issue[] = []
		for (const issue of items) {
			issues.push(this.toDomain(issue))
		}
		return issues
	}
}
