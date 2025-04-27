import { Activity, ActivityType } from "../activity"

export interface WorkflowFailedMetadata {
	message: string
	phase: string
}

export class WorkflowFailed extends Activity {
	constructor(
		id: string,
		type: ActivityType.WORKFLOW_FAILED,
		issueId: string,
		userId: string,
        metadata: WorkflowFailedMetadata,
        occurredAt: string
    ) {
        super(id, type, issueId, userId, metadata, occurredAt)
    }
    
    static create(userId: string, issueId: string, phase: string): Activity {
        
        const id = this.generateId()
        const type = ActivityType.WORKFLOW_FAILED
        const occurredAt = this.now()

        const message = `${userId} failed workflow ${phase}`
        const metadata: WorkflowFailedMetadata = {
            message: message,
            phase: phase
        }

        return new WorkflowFailed(id, type, issueId, userId, metadata, occurredAt)
    }
}