import { WorkflowRun } from "@domain/entities/activities/workflow-run"
import { Pagination } from "@domain/types/activity"

export interface FetchWorkflowRunTimeline {
    execute(projectId: string, pagination: Pagination): Promise<WorkflowRun[]>
}