import { WorkflowRun } from "@domain/entities/activities/workflow-run"
import { Activity } from "@domain/entities/activity"
import { Pagination, ActivityMetadata } from "@domain/types/activity"

export interface ActivityRepository {
    save(activity: Activity<ActivityMetadata>): Promise<Activity<ActivityMetadata>>
    findById(id: string): Promise<Activity<ActivityMetadata> | null>
    findAllByIssueId(issueId: string): Promise<Activity<ActivityMetadata>[]>
    findWorkflowRuns(projectId: string, pagination: Pagination): Promise<WorkflowRun[]>
}