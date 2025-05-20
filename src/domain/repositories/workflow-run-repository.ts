import { WorkflowRun } from "@domain/entities/workflow-run"
import { PaginationData } from "@domain/types/activity"
import { TimeRangeData, WorkflowRunHeatmap } from "@domain/types/workflow"

export interface WorkflowRunRepository {
    save(workflowRun: WorkflowRun): Promise<WorkflowRun>
    findById(id: string): Promise<WorkflowRun | null>
    getTimelineByProjectId(projectId: string, pagination: PaginationData): Promise<WorkflowRun[]>
    getTimelineByAccountId(accountId: string, pagination: PaginationData): Promise<WorkflowRun[]>
    getHeatmap(accountId: string, timeRange: TimeRangeData): Promise<WorkflowRunHeatmap[]> 
}