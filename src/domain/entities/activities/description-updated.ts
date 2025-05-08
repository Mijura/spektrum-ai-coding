import { ActivityType, DescriptionUpdatedMetadata } from "@domain/types/activity"
import { Activity } from "../activity"
import { Task } from "../task"

export class DescriptionUpdated extends Activity<DescriptionUpdatedMetadata> {

    constructor(
        id: string, 
        type: ActivityType.DESCRIPTION_UPDATED, 
        projectId: string,
        taskId: string, 
        userId: string, 
        metadata: DescriptionUpdatedMetadata, 
        occurredAt: string
    ) {
        super(id, type, projectId, taskId, userId, metadata, occurredAt)
    }

    static create(userId: string, task: Task, newDescription: string): Activity<DescriptionUpdatedMetadata> {
  
        const id = this.generateId()
		const type = ActivityType.DESCRIPTION_UPDATED
		const occurredAt = this.now()

		const message = `${userId} updated description`
		const metadata: DescriptionUpdatedMetadata = {
			message: message,
			oldDescription: task.description,
			newDescription: newDescription
		}

		return new DescriptionUpdated(id, type, task.projectId, task.id, userId, metadata, occurredAt)
    }
}
