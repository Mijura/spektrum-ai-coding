import { TaskExecutionStatus } from "@domain/value-objects/activity"
import { Task } from "./task"
import { v4 as uuidv4 } from "uuid"
import { EmitNewTaskExecution } from "@domain/events/emitters/new-task-execution"
import { EmitTaskExecutionUpdate } from "@domain/events/emitters/task-execution-update"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"

export class TaskExecution {
    public readonly id: string
    public title: string
    public readonly projectId: string
    public readonly taskId: string
    public readonly accountId: string
    public status: TaskExecutionStatus
    public artifact: FileArtifacts | null
    public occurredAt: string
    public error?: string

    constructor(
        id: string,
        title: string,
        projectId: string,
        taskId: string,
        accountId: string,
        status: TaskExecutionStatus,
        occurredAt: string,
        artifact: FileArtifacts | null,
        error?: string,
    ) { 
        this.id = id
        this.projectId = projectId
        this.taskId = taskId
        this.accountId = accountId
        this.title = title
        this.status = status
        this.occurredAt = occurredAt
        this.error = error
        this.artifact = artifact
    }

    static create(task: Task, accountId: string): TaskExecution {
        
        const id = uuidv4()
        const occurredAt = new Date().toISOString()
        const status = TaskExecutionStatus.RUNNING

        const execution = new TaskExecution(id, task.title, task.projectId, task.id, accountId, status, occurredAt, null)
        EmitNewTaskExecution.emit(execution)
        
        return execution
    }

    @EmitTaskExecutionUpdate()
    finishSuccessfully(artifact: any): void {
        this.status = TaskExecutionStatus.SUCCEEDED
        this.artifact = artifact
    }

    @EmitTaskExecutionUpdate()
    finishWithError(error: string, artifact: any): void {
        this.status = TaskExecutionStatus.FAILED
        this.error = error
        this.artifact = artifact
    }
}