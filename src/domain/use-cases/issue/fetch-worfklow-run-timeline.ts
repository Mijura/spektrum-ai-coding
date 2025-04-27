import { WorkflowRun } from "@domain/entities/activities/workflow-run"


export interface FetchWorkflowRunTimeline {
    execute(issueId: string): Promise<WorkflowRun[]>
}