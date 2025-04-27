import { IssueRecord } from "@infrastructure/records/issue"
import { Comment } from "@domain/entities/comment"
import { Issue } from "@domain/entities/issue"


export class IssueMapper {

  /** Converts an Issue domain entity to a raw record */
  static toRecord(issue: Issue): IssueRecord {
    return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        projectId: issue.projectId,
        created: issue.created,
        updated: issue.updated,
        status: issue.status,
        comments: issue.getComments().map(comment => ({
            id: comment.id,
            authorId: comment.authorId,
            text: comment.text,
            createdAt: comment.createdAt,
            editedAt: comment.editedAt,
        }))
    }
  }

  /** Converts a raw issue record back to an Issue domain entity */
  static toDomain(record: IssueRecord): Issue {
    return Issue.rehydrate({
        id: record.id,
        title: record.title,
        description: record.description,
        projectId: record.projectId,
        created: record.created,
        updated: record.updated,
        status: record.status,
        comments: record.comments.map(comment => Comment.rehydrate({
            id: comment.id,
            authorId: comment.authorId,
            text: comment.text,
            createdAt: comment.createdAt,
            editedAt: comment.editedAt,
        }))
    })
  }

  static toDomains(items: IssueRecord[]): Issue[] {
		let issues: Issue[] = []
		for (const issue of items) {
			issues.push(this.toDomain(issue))
		}
		return issues
	}
}
