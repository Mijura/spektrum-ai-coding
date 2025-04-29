import { ActivityType, DescriptionUpdatedMetadata } from "@domain/types/activity"
import { Activity } from "../activity"
import { Issue } from "../issue"

export class DescriptionUpdated extends Activity<DescriptionUpdatedMetadata> {

    constructor(
        id: string, 
        type: ActivityType.DESCRIPTION_UPDATED, 
        projectId: string,
        issueId: string, 
        userId: string, 
        metadata: DescriptionUpdatedMetadata, 
        occurredAt: string
    ) {
        super(id, type, projectId, issueId, userId, metadata, occurredAt)
    }

    static create(userId: string, issue: Issue, newDescription: string): Activity<DescriptionUpdatedMetadata> {
  
        const id = this.generateId()
		const type = ActivityType.DESCRIPTION_UPDATED
		const occurredAt = this.now()

		const message = `${userId} updated description`
		const metadata: DescriptionUpdatedMetadata = {
			message: message,
			oldDescription: issue.description,
			newDescription: newDescription
		}

		return new DescriptionUpdated(id, type, issue.projectId, issue.id, userId, metadata, occurredAt)
    }
}
