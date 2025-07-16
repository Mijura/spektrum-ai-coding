import { ActivityMetadata, ActivityType, StartedWorkMetadata } from "@domain/value-objects/activity"
import { Activity } from "../activity"
import { Task } from "../task"

export class StartedWork extends Activity<StartedWorkMetadata> {
    constructor(
        id: string,
        type: ActivityType.STARTED_WORK,
        projectId: string,
        taskId: string,
        workerId: string,
        metadata: StartedWorkMetadata,
        occurredAt: string
    ) {
        super(id, type, projectId, taskId, workerId, metadata, occurredAt)
    }

    static create(workerId: string, task: Task, message: string): Activity<ActivityMetadata> {
        const id = this.generateId()
        const type = ActivityType.STARTED_WORK
        const occurredAt = this.now()

        const metadata: StartedWorkMetadata = {
            workerId: workerId,
            message: message
        }

        return new StartedWork(id, type, task.projectId, task.id, workerId, metadata, occurredAt)
    }
}   
