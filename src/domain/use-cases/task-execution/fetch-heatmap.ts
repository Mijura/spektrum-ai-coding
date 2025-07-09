import { TaskExecutionHeatmap, TimeRangeData } from "@domain/types/task-execution"

export interface FetchTaskExecutionsHeatmap {
    execute(accountId: string, timeRange: TimeRangeData): Promise<TaskExecutionHeatmap[]>
}