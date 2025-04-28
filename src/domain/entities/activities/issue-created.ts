import { ActivityType, IssueCreatedMetadata } from "@domain/types/activity"
import { Activity } from "../activity"
import { Issue } from "../issue"
export class IssueCreatedActivity extends Activity<IssueCreatedMetadata> {
	
    constructor(
        id: string,
        type: ActivityType.ISSUE_CREATED,
        projectId: string,
        issueId: string, 
        userId: string, 
        metadata: IssueCreatedMetadata, 
        occurredAt: string
    ) {
		super(id, type, projectId, issueId, userId, metadata, occurredAt)
	}

    static create(userId: string, issue: Issue): Activity<IssueCreatedMetadata> {
		
        const id = this.generateId()
		const type = ActivityType.ISSUE_CREATED
		const occurredAt = this.now()

        const message = `${userId} created issue`
		const metadata: IssueCreatedMetadata = {
			message: message,
			title: issue.title,
			description: issue.description
		}
	
		return new IssueCreatedActivity(id, type, issue.projectId, issue.id, userId, metadata, occurredAt)
    }
}