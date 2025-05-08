import { ActivityMetadata, ActivityType, FinishedWorkMetadata } from "@domain/types/activity";
import { Activity } from "../activity";
import { Task } from "../task";

export class FinishedWork extends Activity<FinishedWorkMetadata> {
    constructor(
        id: string,
        type: ActivityType.FINISHED_WORK,
        projectId: string,
        taskId: string,
        workerId: string,
        metadata: FinishedWorkMetadata,
        occurredAt: string
    ) {
        super(id, type, projectId, taskId, workerId, metadata, occurredAt)
    }

    static create(workerId: string, task: Task, phase: string, message: string): Activity<ActivityMetadata> {
        const id = this.generateId()
        const type = ActivityType.FINISHED_WORK
        const occurredAt = this.now()

        const metadata: FinishedWorkMetadata = {
            workerId: workerId,
            message: message,
            phase: phase
        }

        return new FinishedWork(id, type, task.projectId, task.id, workerId, metadata, occurredAt)
    }
}