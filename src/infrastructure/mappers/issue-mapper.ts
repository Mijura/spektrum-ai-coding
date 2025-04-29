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
        activities: issue.getActivityLog().map(activity => ({
            id: activity.id,
            type: activity.type,
            projectId: activity.projectId,
            issueId: activity.issueId,
            userId: activity.userId,
            metadata: activity.metadata,
            occurredAt: activity.occurredAt,
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
        activities: record.activities.map(activity => ({
          id: activity.id,
          type: activity.type,
          projectId: activity.projectId,
          issueId: activity.issueId,
          userId: activity.userId,
          metadata: activity.metadata,
          occurredAt: activity.occurredAt,
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
