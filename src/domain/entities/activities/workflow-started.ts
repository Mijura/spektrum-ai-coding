import { Activity, ActivityType } from "../activity"

export interface WorkflowStartedMetadata {
	message: string;
	phase: string;
}

export class WorkflowStarted extends Activity {

    constructor(
        id: string, 
        type: ActivityType.WORKFLOW_STARTED, 
        issueId: string, 
        userId: string, 
        metadata: WorkflowStartedMetadata, 
        occurredAt: string
    ) {
        super(id, type, issueId, userId, metadata, occurredAt)
    }

    static create(userId: string, issueId: string, phase: string): Activity {
        
        const id = this.generateId()
        const type = ActivityType.WORKFLOW_STARTED
        const occurredAt = this.now()

        const message = `${userId} started workflow ${phase}`
        const metadata: WorkflowStartedMetadata = {
            message: message,
            phase: phase
        }

        return new WorkflowStarted(id, type, issueId, userId, metadata, occurredAt)
    }   
}