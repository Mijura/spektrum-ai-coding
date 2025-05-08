import { ActivityType, TitleUpdatedMetadata } from "@domain/types/activity"
import { Activity } from "../activity"
import { Task } from "../task"

export class TitleUpdated extends Activity<TitleUpdatedMetadata> {

    constructor(
        id: string, 
        type: ActivityType.TITLE_UPDATED, 
        projectId: string,
        taskId: string,
        userId: string, 
        metadata: TitleUpdatedMetadata, 
        occurredAt: string
    ) {
        super(id, type, projectId, taskId, userId, metadata, occurredAt)
    }

    static create(userId: string, task: Task, newTitle: string): Activity<TitleUpdatedMetadata> {
		
        const id = this.generateId()
		const type = ActivityType.TITLE_UPDATED
		const occurredAt = this.now()
        
        const message = `${userId} changed title to "${newTitle}"`
		const metadata: TitleUpdatedMetadata = {
			message: message,
			oldTitle: task.title,
			newTitle: newTitle
		}

		return new TitleUpdated(id, type, task.projectId, task.id, userId, metadata, occurredAt)
    }
}