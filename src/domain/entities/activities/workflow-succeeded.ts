import { Activity, ActivityType } from "../activity"

export interface WorkflowSucceededMetadata {
	message: string;
	phase: string;
}

export class WorkflowSucceeded extends Activity {
	constructor(
		id: string,
		type: ActivityType.WORKFLOW_SUCCEEDED,
		issueId: string,
		userId: string,
        metadata: WorkflowSucceededMetadata,
        occurredAt: string
    ) {
        super(id, type, issueId, userId, metadata, occurredAt)
    }
    
    static create(userId: string, issueId: string, phase: string): Activity {
		
        const id = this.generateId()
		const type = ActivityType.WORKFLOW_SUCCEEDED
		const occurredAt = this.now()

        const message = `${userId} succeeded workflow ${phase}`
		const metadata: WorkflowSucceededMetadata = {
			message: message,
			phase: phase
		}

		return new WorkflowSucceeded(id, type, issueId, userId, metadata, occurredAt)
	}
}