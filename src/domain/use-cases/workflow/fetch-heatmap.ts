import { TimeRangeData, WorkflowRunHeatmap } from "@domain/types/workflow"

export interface FetchWorkflowRunsHeatmap {
    execute(accountId: string, timeRange: TimeRangeData): Promise<WorkflowRunHeatmap[]>
}