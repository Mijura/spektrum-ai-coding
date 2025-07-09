import { TaskExecution } from "@domain/entities/task-execution"
import { PaginationData } from "@domain/types/activity"
import { TimeRangeData, TaskExecutionHeatmap } from "@domain/types/workflow"

export interface TaskExecutionRepository {
    save(taskExecution: TaskExecution): Promise<TaskExecution>
    get(taskExecutionId: string): Promise<TaskExecution | null>
    getTimelineByProjectId(projectId: string, pagination: PaginationData): Promise<TaskExecution[]>
    getTimelineByAccountId(accountId: string, pagination: PaginationData): Promise<TaskExecution[]>
    getHeatmap(accountId: string, timeRange: TimeRangeData): Promise<TaskExecutionHeatmap[]> 
}