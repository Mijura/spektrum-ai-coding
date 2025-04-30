import { ActivityMetadata, ActivityType, FinishedWorkMetadata } from "@domain/types/activity";
import { Activity } from "../activity";
import { Issue } from "../issue";

export class FinishedWork extends Activity<FinishedWorkMetadata> {
    constructor(
        id: string,
        type: ActivityType.FINISHED_WORK,
        projectId: string,
        issueId: string,
        workerId: string,
        metadata: FinishedWorkMetadata,
        occurredAt: string
    ) {
        super(id, type, projectId, issueId, workerId, metadata, occurredAt)
    }

    static create(workerId: string, issue: Issue, phase: string): Activity<ActivityMetadata> {
        const id = this.generateId()
        const type = ActivityType.FINISHED_WORK
        const occurredAt = this.now()

        const metadata: FinishedWorkMetadata = {
            workerId: workerId,
            message: `${workerId} finished working on ${issue.title}`,
            phase: phase
        }

        return new FinishedWork(id, type, issue.projectId, issue.id, workerId, metadata, occurredAt)
    }
}