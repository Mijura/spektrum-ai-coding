import { WorkflowRun } from "@domain/entities/activities/workflow-run"
import { Activity, ActivityMetadata } from "@domain/entities/activity"

export interface ActivityRepository {
    save(activity: Activity<ActivityMetadata>): Promise<Activity<ActivityMetadata>>
    findAllByIssueId(issueId: string): Promise<Activity<ActivityMetadata>[]>
    findAllByIssueIdAndWorkflowRun(issueId: string): Promise<WorkflowRun[]>
}