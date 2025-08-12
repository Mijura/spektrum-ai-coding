import { TaskExecutionStatus } from "@domain/value-objects/activity"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"

export interface TaskExecutionRecord {
    id: string
    title: string
    projectId: string
    taskId: string
    accountId: string
    status: TaskExecutionStatus
    occurredAt: string
    error?: string
} 