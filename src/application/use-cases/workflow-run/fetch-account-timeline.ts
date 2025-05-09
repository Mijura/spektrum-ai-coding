import { WorkflowRun } from "@domain/entities/workflow/workflow-run"
import { WorkflowRunRepository } from "@domain/repositories/workflow-run-repository"
import { PaginationData } from "@domain/types/activity"
import { FetchWorkflowRunsTimeline } from "@domain/use-cases/workflow-run/fetch-timeline"

export class FetchTimelineByAccountIdUseCase implements FetchWorkflowRunsTimeline {
    constructor(private readonly workflowRunRepository: WorkflowRunRepository) {}

    async execute(accountId: string, pagination: PaginationData): Promise<WorkflowRun[]> {
        return await this.workflowRunRepository.getTimelineByAccountId(accountId, pagination)
    }
}