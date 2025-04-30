import { WorkflowRun } from "@domain/entities/workflow-run"
import { fetchWorkflowRunTimeline } from "@infrastructure/dependencies"
import { Request, Response } from "express"

export class WorkflowRunController {

    constructor() {}

    async fetchTimeline(req: Request, res: Response): Promise<void> {
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