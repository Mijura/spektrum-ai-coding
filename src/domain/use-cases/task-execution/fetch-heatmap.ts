import { TaskExecutionHeatmap, TimeRangeData } from "@domain/types/workflow"

export interface FetchTaskExecutionsHeatmap {
    execute(accountId: string, timeRange: TimeRangeData): Promise<TaskExecutionHeatmap[]>
}