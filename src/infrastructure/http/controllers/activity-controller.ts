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
        const projectId  = req.query.projectId as string
        const page = req.query.page as string
        const size = req.query.size as string
        
        if (!projectId || !page || !size) {
            res.status(400).json({ error: "Missing required parameters" })
            return
        }
        
        const pagination = {
            pageNumber: parseInt(page),
            pageSize: parseInt(size)
        }

        const activities: WorkflowRun[] = await fetchWorkflowRunTimeline.execute(projectId, pagination)
        
        res.json(activities)
    }
    
}