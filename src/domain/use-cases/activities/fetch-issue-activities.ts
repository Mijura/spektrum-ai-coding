import { Activity } from "@domain/entities/activity"
import { ActivityMetadata } from "@domain/types/activity"

export interface FetchIssueActivities {
    execute(issueId: string): Promise<Activity<ActivityMetadata>[]>
}