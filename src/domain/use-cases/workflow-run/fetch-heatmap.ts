import { WorkflowRun } from "@domain/entities/workflow-run";
import { TimeRangeData } from "@domain/types/activity";

export interface FetchWorkflowRunsHeatmap {
    execute(userId: string, timeRange: TimeRangeData): Promise<WorkflowRun[]>
}