import { WorkflowRun } from "@domain/entities/activities/workflow-run"
import { fetchIssueActivities, fetchWorkflowRunTimeline } from "@infrastructure/dependencies"
import { Request, Response } from "express"

export class ActivityController {

    constructor() {}

    async fetchActivities(req: Request, res: Response): Promise<void> {
        const { issueId } = req.params
        const activities = await fetchIssueActivities.execute(issueId)
        res.json(activities)
    }

    async fetchWorkflowRunTimeline(req: Request, res: Response): Promise<void> {
        const { projectId, pagination } = req.body
        const { pageNumber, pageSize } = JSON.parse(pagination)
        const activities: WorkflowRun[] = await fetchWorkflowRunTimeline.execute(projectId, { pageNumber, pageSize })
        
        res.json(activities)
    }
    
}