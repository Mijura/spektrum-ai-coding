import { WorkflowRunStatus } from "@domain/types/activity"
import { Task } from "../task"
import { v4 as uuidv4 } from "uuid"
import { EmitNewWorkflowRun } from "@domain/events/emitters/new-workflow-run"
import { EmitWorkflowRunUpdate } from "@domain/events/emitters/workflow-run-update"

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
    public readonly taskId: string
    public readonly workflowId: string
    public readonly accountId: string
    public status: WorkflowRunStatus
	public phase: WorkflowPhase | null
    public occurredAt: string
    public error?: string

    constructor(
        id: string,
        title: string,
        projectId: string,
        taskId: string,
        workflowId: string,
        accountId: string,
        status: WorkflowRunStatus,
        phase: WorkflowPhase | null,
        occurredAt: string,
        error?: string
    ) { 
        this.id = id
        this.projectId = projectId
        this.taskId = taskId
        this.workflowId = workflowId
        this.accountId = accountId
        this.title = title
        this.status = status
        this.phase = phase
        this.occurredAt = occurredAt
        this.error = error
    }

    static create(task: Task, workflowId: string, accountId: string): WorkflowRun {
        
        const id = uuidv4()
        const occurredAt = new Date().toISOString()
        const status = WorkflowRunStatus.RUNNING
        const phase = null

        const run = new WorkflowRun(id, task.title, task.projectId, task.id, workflowId, accountId, status, phase, occurredAt)
        EmitNewWorkflowRun.emit(run)
        
        return run
    }

    @EmitWorkflowRunUpdate()
    finishSuccessfully(): void {
        this.status = WorkflowRunStatus.SUCCEEDED

    }

    switchPhase(phase:WorkflowPhase): void {
        this.phase = phase
    }

    @EmitWorkflowRunUpdate()
    finishWithError(error: string): void {

        this.status = WorkflowRunStatus.FAILED
        this.error = error
    }
}