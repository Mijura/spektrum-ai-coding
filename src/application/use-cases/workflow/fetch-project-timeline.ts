import { WorkflowRun } from "@domain/entities/workflow-run"
import { WorkflowRunRepository } from "@domain/repositories/workflow-run-repository"
import { PaginationData } from "@domain/types/activity"
import { FetchWorkflowRunsTimeline } from "@domain/use-cases/workflow/fetch-timeline"

export class FetchTimelineByProjectIdUseCase implements FetchWorkflowRunsTimeline {
    constructor(private readonly workflowRunRepository: WorkflowRunRepository) {}

    async execute(projectId: string, pagination: PaginationData): Promise<WorkflowRun[]> {
        return await this.workflowRunRepository.getTimelineByProjectId(projectId, pagination)
    }
}