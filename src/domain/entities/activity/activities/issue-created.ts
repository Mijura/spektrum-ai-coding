import { IssueActivity, ActivityType } from "../issue-activity"

export interface IssueCreatedMetadata {
	message: string
	title: string
	description: string
}

export class IssueCreated extends IssueActivity {
	
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

    static create(userId: string, issueId: string, title: string, description: string): IssueActivity {
		
        const id = this.generateId()
		const type = ActivityType.ISSUE_CREATED
		const occurredAt = this.now()

        const message = `${userId} created issue`
		const metadata: IssueCreatedMetadata = {
			message: message,
			title: title,
			description: description
		}
	
		return new IssueCreated(id, type, issueId, userId, metadata, occurredAt)
    }
}