import { ActivityType, WorkflowRunMetadata, WorkflowRunStatus } from "@domain/types/activity"
import { Activity } from "../activity"
import { Issue } from "../issue"

export class WorkflowRun extends Activity<WorkflowRunMetadata> {

    constructor(
        id: string, 
        type: ActivityType.WORKFLOW_RUN, 
        projectId: string,
        issueId: string, 
        userId: string, 
        metadata: WorkflowRunMetadata, 
        occurredAt: string
    ) {
        super(id, type, projectId, issueId, userId, metadata, occurredAt)
    }

    static create(userId: string, issue: Issue, workflowId: string, phase: string): Activity<WorkflowRunMetadata> {
        
        const id = this.generateId()
        const type = ActivityType.WORKFLOW_RUN
        const occurredAt = this.now()

        const message = `${userId} started workflow ${phase}`
        const metadata: WorkflowRunMetadata = {
            workflowId: workflowId,
            message: message,
            phase: phase,
            status: WorkflowRunStatus.RUNNING,
            title: issue.title
        }

        return new WorkflowRun(id, type, issue.projectId, issue.id, userId, metadata, occurredAt)
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