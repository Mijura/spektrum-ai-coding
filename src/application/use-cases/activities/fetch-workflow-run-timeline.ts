import { WorkflowRun } from "@domain/entities/activities/workflow-run"
import { ActivityRepository } from "@domain/repositories/activity-repository"
import { FetchWorkflowRunTimeline } from "@domain/use-cases/issue/fetch-worfklow-run-timeline"

export class FetchWorkflowRunTimelineUseCase implements FetchWorkflowRunTimeline {
    constructor(private readonly activityRepository: ActivityRepository) {}

    async execute(issueId: string): Promise<WorkflowRun[]> {
        return this.activityRepository.findAllByIssueIdAndWorkflowRun(issueId)
    }
}   