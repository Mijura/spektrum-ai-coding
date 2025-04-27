import { Activity, ActivityMetadata } from "@domain/entities/activity"

export interface FetchIssueActivities {
    execute(issueId: string): Promise<Activity<ActivityMetadata>[]>
}