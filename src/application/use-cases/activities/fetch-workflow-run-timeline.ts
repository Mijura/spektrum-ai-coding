import { WorkflowRun } from "@domain/entities/activities/workflow-run"
import { ActivityRepository } from "@domain/repositories/activity-repository"
import { PaginationData } from "@domain/types/activity"
import { FetchWorkflowRunTimeline } from "@domain/use-cases/activities/fetch-worfklow-run-timeline"

export class FetchWorkflowRunTimelineUseCase implements FetchWorkflowRunTimeline {
    constructor(private readonly activityRepository: ActivityRepository) {}

    async execute(projectId: string, pagination: PaginationData): Promise<WorkflowRun[]> {
        return this.activityRepository.fetchWorkflowRunTimeline(projectId, pagination)
    }
}   