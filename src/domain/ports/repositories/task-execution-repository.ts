import { TaskExecution } from "@domain/entities/task-execution"
import { PaginationData } from "@domain/value-objects/activity"
import { TimeRangeData, TaskExecutionHeatmap } from "@domain/value-objects/task-execution"

export interface TaskExecutionRepository {
    save(taskExecution: TaskExecution): Promise<TaskExecution>
    get(taskExecutionId: string): Promise<TaskExecution | null>
    getTimelineByProjectId(projectId: string, pagination: PaginationData): Promise<TaskExecution[]>
    getTimelineByAccountId(accountId: string, pagination: PaginationData): Promise<TaskExecution[]>
    getHeatmap(accountId: string, timeRange: TimeRangeData): Promise<TaskExecutionHeatmap[]> 
}