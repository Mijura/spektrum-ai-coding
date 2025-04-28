import { Activity } from "@domain/entities/activity"
import { ActivityRepository } from "@domain/repositories/activity-repository"
import { ActivityMetadata } from "@domain/types/activity"
import { FetchIssueActivities } from "@domain/use-cases/issue/fetch-issue-activities"

export class FetchIssueActivitiesUseCase implements FetchIssueActivities {
    constructor(private readonly activityRepository: ActivityRepository) {}

    async execute(issueId: string): Promise<Activity<ActivityMetadata>[]> {
        return this.activityRepository.findAllByIssueId(issueId)
    }
}

