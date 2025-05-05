import { WorkflowRunStatus } from "@domain/types/activity"
import { Issue } from "../issue"
import { v4 as uuidv4 } from "uuid"

class WorkflowPhase {
    public readonly name: string
    public readonly description: string
    public readonly worker: string

    constructor(name: string, description: string, worker: string) {
        this.name = name
        this.description = description
        this.worker = worker
    }
}
export class WorkflowRun {
    public readonly id: string
    public title: string
    public readonly projectId: string
    public readonly issueId: string
    public readonly workflowId: string
    public status: WorkflowRunStatus
	public phase: WorkflowPhase | null
    public timestamp: string
    public error?: string

    constructor(
        id: string,
        title: string,
        projectId: string,
        issueId: string,
        workflowId: string,
        status: WorkflowRunStatus,
        phase: WorkflowPhase | null,
        timestamp: string,
        error?: string
    ) { 
        this.id = id
        this.projectId = projectId
        this.issueId = issueId
        this.workflowId = workflowId
        this.title = title
        this.status = status
        this.phase = phase
        this.timestamp = timestamp
        this.error = error
    }

    static create(issue: Issue, workflowId: string): WorkflowRun {
        
        const id = uuidv4()
        const timestamp = new Date().toISOString()
        const status = WorkflowRunStatus.RUNNING
        const phase = null

        return new WorkflowRun(id, issue.title, issue.projectId, issue.id, workflowId, status, phase, timestamp)
    }

    finishSuccessfully(): void {
        this.status = WorkflowRunStatus.SUCCEEDED

    }

    switchPhase(phase:WorkflowPhase): void {
        this.phase = phase
    }

    finishWithError(error: string): void {

        this.status = WorkflowRunStatus.FAILED
        this.error = error
    }
}