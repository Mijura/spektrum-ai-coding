
import { WorkflowRun } from "@domain/entities/workflow/workflow-run"
import { fetchWorkflowRunTimeline, runPrototypingWorkflow } from "@infrastructure/dependencies"
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

    async triggerPrototypingWorkflow(req: Request, res: Response): Promise<void> {
        
        const issueId = req.body.issueId
        const accountId = req.body.accountId

        console.log("Running prototyping workflow for issue:", issueId, "and account:", accountId)
        if (!issueId || !accountId) {
            res.status(400).json({ error: "Missing required parameters" })
            return
        }

		try {
            runPrototypingWorkflow.run(issueId, accountId)
            res.status(200).json({ message: "Workflow run initiated" })
		} catch (error) {
			console.error("Error during development workflow:", error)
            res.status(500).json({ error: "Internal server error" })
		}

    }
    
}