import { WorkflowRun } from "@domain/entities/workflow/workflow-run"
import { PaginationData } from "@domain/types/activity"

export interface FetchWorkflowRunsTimeline {
    execute(projectId: string, pagination: PaginationData): Promise<WorkflowRun[]>
}