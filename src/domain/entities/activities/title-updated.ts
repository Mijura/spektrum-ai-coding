import { ActivityType, TitleUpdatedMetadata } from "@domain/types/activity"
import { Activity } from "../activity"

export class TitleUpdated extends Activity<TitleUpdatedMetadata> {

    constructor(
        id: string, 
        type: ActivityType.TITLE_UPDATED, 
        projectId: string,
        issueId: string, 
        userId: string, 
        metadata: TitleUpdatedMetadata, 
        occurredAt: string
    ) {
        super(id, type, projectId, issueId, userId, metadata, occurredAt)
    }

    static create(projectId: string, userId: string, issueId: string, oldTitle: string, newTitle: string): Activity<TitleUpdatedMetadata> {
		
        const id = this.generateId()
		const type = ActivityType.TITLE_UPDATED
		const occurredAt = this.now()
        
        const message = `${userId} changed title to "${newTitle}"`
		const metadata: TitleUpdatedMetadata = {
			message: message,
			oldTitle: oldTitle,
			newTitle: newTitle
		}

		return new TitleUpdated(id, type, projectId, issueId, userId, metadata, occurredAt)
    }
}