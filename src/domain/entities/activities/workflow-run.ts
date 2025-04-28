import { ActivityType, WorkflowRunMetadata, WorkflowRunStatus } from "@domain/types/activity"
import { Activity } from "../activity"

export class WorkflowRun extends Activity<WorkflowRunMetadata> {

    constructor(
        id: string, 
        type: ActivityType.WORKFLOW_RUN, 
        issueId: string, 
        userId: string, 
        metadata: WorkflowRunMetadata, 
        occurredAt: string
    ) {
        super(id, type, issueId, userId, metadata, occurredAt)
    }

    static create(userId: string, issueId: string, phase: string): Activity<WorkflowRunMetadata> {
        
        const id = this.generateId()
        const type = ActivityType.WORKFLOW_RUN
        const occurredAt = this.now()

        const message = `${userId} started workflow ${phase}`
        const metadata: WorkflowRunMetadata = {
            message: message,
            phase: phase,
            status: WorkflowRunStatus.RUNNING
        }

        return new WorkflowRun(id, type, issueId, userId, metadata, occurredAt)
    }

    succeeded(): void {

        const message = `Workflow run succeeded`

        this.metadata.status = WorkflowRunStatus.SUCCEEDED
        this.metadata.message = message

    }

    switchedPhase(phase: string, message: string): void {
        this.metadata.phase = phase
        this.metadata.message = message
    }

    failed(error: string): void {

        const message = `Workflow run failed`

        this.metadata.status = WorkflowRunStatus.FAILED
        this.metadata.message = message
        this.metadata.error = error
    }
}