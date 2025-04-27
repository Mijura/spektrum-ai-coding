import { Activity, ActivityType } from "../activity"
import { Issue } from "../issue"
export interface IssueCreatedMetadata {
	message: string
	title: string
	description: string
}

export class IssueCreatedActivity extends Activity<IssueCreatedMetadata> {
	
    constructor(
        id: string,
        type: ActivityType.ISSUE_CREATED,
        issueId: string, 
        userId: string, 
        metadata: IssueCreatedMetadata, 
        occurredAt: string
    ) {
		super(id, type, issueId, userId, metadata, occurredAt)
	}

    static create(actorId: string, issue: Issue): Activity<IssueCreatedMetadata> {
		
        const id = this.generateId()
		const type = ActivityType.ISSUE_CREATED
		const occurredAt = this.now()

        const message = `${actorId} created issue`
		const metadata: IssueCreatedMetadata = {
			message: message,
			title: issue.title,
			description: issue.description
		}
	
		return new IssueCreatedActivity(id, type, issue.id, actorId, metadata, occurredAt)
    }
}