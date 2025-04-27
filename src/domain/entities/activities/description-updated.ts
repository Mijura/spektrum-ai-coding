import { Activity, ActivityType } from "../activity"

export interface DescriptionUpdatedMetadata {
	message: string
	oldDescription: string
	newDescription: string
}

export class DescriptionUpdated extends Activity {

    constructor(
        id: string, 
        type: ActivityType.DESCRIPTION_UPDATED, 
        issueId: string, 
        userId: string, 
        metadata: DescriptionUpdatedMetadata, 
        occurredAt: string
    ) {
        super(id, type, issueId, userId, metadata, occurredAt)
    }

    static create(userId: string, issueId: string, oldDescription: string, newDescription: string): Activity {
  
        const id = this.generateId()
		const type = ActivityType.DESCRIPTION_UPDATED
		const occurredAt = this.now()

		const message = `${userId} updated description`
		const metadata: DescriptionUpdatedMetadata = {
			message: message,
			oldDescription: oldDescription,
			newDescription: newDescription
		}

		return new DescriptionUpdated(id, type, issueId, userId, metadata, occurredAt)
    }
}
