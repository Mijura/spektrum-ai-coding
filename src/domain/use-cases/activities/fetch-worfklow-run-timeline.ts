import { WorkflowRun } from "@domain/entities/activities/workflow-run"
import { PaginationData } from "@domain/types/activity"

export interface FetchWorkflowRunTimeline {
    execute(projectId: string, pagination: PaginationData): Promise<WorkflowRun[]>
}