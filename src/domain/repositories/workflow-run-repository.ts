import { WorkflowRun } from "@domain/entities/workflow/workflow-run"
import { PaginationData } from "@domain/types/activity"

export interface WorkflowRunRepository {
    save(workflowRun: WorkflowRun): Promise<WorkflowRun>
    findById(id: string): Promise<WorkflowRun | null>
    getTimeline(projectId: string, pagination: PaginationData): Promise<WorkflowRun[]>
}