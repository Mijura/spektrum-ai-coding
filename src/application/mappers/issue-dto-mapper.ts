import { Issue } from "@domain/entities/issue"
import { Comment } from "@domain/entities/comment"
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
			comments: issue.getComments().map(comment => {
                return {
                    id: comment.id,
                    authorId: comment.authorId,
                    text: comment.text,
                    createdAt: comment.createdAt,
                    editedAt: comment.editedAt,
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

		const comments: Comment[] = []
		for (const dto of data.comments) {
			comments.push(Comment.rehydrate(dto))
		}

		return Issue.rehydrate({
			id: data.id, 
			created: data.created, 
			projectId: data.projectId, 
			title: data.title, 
			description: data.description, 
			status: data.status, 
			updated: data.updated,
			comments: comments
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
