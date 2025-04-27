import { Activity, ActivityType } from "../activity"

export interface TitleUpdatedMetadata {
	message: string
	oldTitle: string
	newTitle: string
}

export class TitleUpdated extends Activity {

    constructor(
        id: string, 
        type: ActivityType.TITLE_UPDATED, 
        issueId: string, 
        userId: string, 
        metadata: TitleUpdatedMetadata, 
        occurredAt: string
    ) {
        super(id, type, issueId, userId, metadata, occurredAt)
    }

    static create(userId: string, issueId: string, oldTitle: string, newTitle: string): Activity {
		
        const id = this.generateId()
		const type = ActivityType.TITLE_UPDATED
		const occurredAt = this.now()
        
        const message = `${userId} changed title to "${newTitle}"`
		const metadata: TitleUpdatedMetadata = {
			message: message,
			oldTitle: oldTitle,
			newTitle: newTitle
		}

		return new TitleUpdated(id, type, issueId, userId, metadata, occurredAt)
    }
}