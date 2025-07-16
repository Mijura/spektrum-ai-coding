import { TaskExecutionHeatmap, TimeRangeData } from "@domain/value-objects/task-execution"

export interface FetchTaskExecutionsHeatmap {
    execute(accountId: string, timeRange: TimeRangeData): Promise<TaskExecutionHeatmap[]>
}