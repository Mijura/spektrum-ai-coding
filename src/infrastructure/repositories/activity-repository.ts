import { WorkflowRun } from "@domain/entities/activities/workflow-run"
import { ActivityMetadata, ActivityType } from "@domain/entities/activity"
import { Activity } from "@domain/entities/activity"
import { ActivityRepository } from "@domain/repositories/activity-repository"

export class OpenSearchActivityRepository implements ActivityRepository {

    private activities: Activity<ActivityMetadata>[] = []

    async save(activity: Activity<ActivityMetadata>): Promise<Activity<ActivityMetadata>> {
        this.activities.push(activity)
        return activity
    }

    async findById(id: string): Promise<Activity<ActivityMetadata> | null> {
        return this.activities.find(activity => activity.id === id) ?? null
    }

    async findAllByIssueId(issueId: string): Promise<Activity<ActivityMetadata>[]> {
        return this.activities.filter(activity => activity.issueId === issueId)
    }   

    async findAllByIssueIdAndWorkflowRun(issueId: string): Promise<WorkflowRun[]> {
        const workflowRuns = this.activities.filter(activity => activity.issueId === issueId && activity.type === ActivityType.WORKFLOW_RUN)
        return workflowRuns as WorkflowRun[]
    }
    
    
}
