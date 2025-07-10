import { ActivityType, TaskCreatedMetadata } from "@domain/types/activity"
import { Activity } from "../activity"
import { Task } from "../task"

export class TaskCreatedActivity extends Activity<TaskCreatedMetadata> {
	
    constructor(
        id: string,
        type: ActivityType.TASK_CREATED,
        projectId: string,
        taskId: string,
        userId: string, 
        metadata: TaskCreatedMetadata, 
        occurredAt: string
    ) {
		super(id, type, projectId, taskId, userId, metadata, occurredAt)
	}

    static create(userId: string, task: Task): Activity<TaskCreatedMetadata> {
		
        const id = this.generateId()
		const type = ActivityType.TASK_CREATED
		const occurredAt = this.now()

        const message = `${userId} created task`
		const metadata: TaskCreatedMetadata = {
			message: message,
			title: task.title,
			description: task.description
		}
	
		return new TaskCreatedActivity(id, type, task.projectId, task.id, userId, metadata, occurredAt)
    }
}