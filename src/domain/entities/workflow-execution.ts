
export enum WorkflowExecutionStatus {
    RUNNING = "Running",
    SUCCEEDED = "Succeeded",
    FAILED = "Failed",
}

export class WorkflowExecution {
	public readonly id: string
    public readonly created: string
    public readonly updated: string | null
    public readonly projectId: string
    public readonly workflowId: string
    public readonly ticketId: string
    public status: WorkflowExecutionStatus
	
    private constructor(
		id: string,
		projectId: string,
		workflowId: string,
        ticketId: string,
		status: WorkflowExecutionStatus,
        created: string,
		updated: string | null
	) {
		this.id = id
		this.projectId = projectId
        this.workflowId = workflowId
        this.ticketId = ticketId
		this.status = status
		this.created = created
		this.updated = updated
	}

	// Factory method to create a new ticket
	static create(id: string, projectId: string, workflowId: string, ticketId: string): WorkflowExecution {

		const created = new Date().toISOString() // ISO format
	
		return new WorkflowExecution(id, projectId, workflowId, ticketId, WorkflowExecutionStatus.RUNNING, created, null)
	}

	/** Restore method to rehydrate a workflow execution from persisted data */
	static restore(data: {
		id: string
		projectId: string
        workflowId: string
        ticketId: string
        status: WorkflowExecutionStatus
        created: string
        updated: string | null
	}): WorkflowExecution {
		return new WorkflowExecution(data.id, data.projectId, data.workflowId, data.ticketId, data.status, data.created, data.updated)
	}


}
