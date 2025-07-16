import { TaskExecution } from "@domain/entities/task-execution"
import { PaginationData } from "@domain/value-objects/activity"

export interface FetchTaskExecutionsTimeline {
    execute(projectId: string, pagination: PaginationData): Promise<TaskExecution[]>
}