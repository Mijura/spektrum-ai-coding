import { TaskExecution } from "@domain/entities/task-execution"
import { PaginationData } from "@domain/types/activity"

export interface FetchTaskExecutionsTimeline {
    execute(projectId: string, pagination: PaginationData): Promise<TaskExecution[]>
}