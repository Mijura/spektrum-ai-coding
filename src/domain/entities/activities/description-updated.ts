import { ActivityType, DescriptionUpdatedMetadata } from "@domain/types/activity"
import { Activity } from "../activity"

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

    static create(projectId: string, userId: string, issueId: string, oldDescription: string, newDescription: string): Activity<DescriptionUpdatedMetadata> {
  
        const id = this.generateId()
		const type = ActivityType.DESCRIPTION_UPDATED
		const occurredAt = this.now()

		const message = `${userId} updated description`
		const metadata: DescriptionUpdatedMetadata = {
			message: message,
			oldDescription: oldDescription,
			newDescription: newDescription
		}

		return new DescriptionUpdated(id, type, projectId, issueId, userId, metadata, occurredAt)
    }
}
