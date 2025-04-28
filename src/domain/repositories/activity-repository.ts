import { WorkflowRun } from "@domain/entities/activities/workflow-run"
import { Activity } from "@domain/entities/activity"
import { PaginationData, ActivityMetadata, TimeRangeData } from "@domain/types/activity"

export interface ActivityRepository {
    save(activity: Activity<ActivityMetadata>): Promise<Activity<ActivityMetadata>>
    findById(id: string): Promise<Activity<ActivityMetadata> | null>
    fetchIssueActivities(issueId: string): Promise<Activity<ActivityMetadata>[]>
    fetchActivitiesHeatmap(userId: string, timeRange: TimeRangeData): Promise<Activity<ActivityMetadata>[]>
    fetchWorkflowRunTimeline(projectId: string, pagination: PaginationData): Promise<WorkflowRun[]>
}