
import { WorkflowRun } from "@domain/entities/task-execution"
import { WorkflowRunHeatmap } from "@domain/types/workflow"
import { fetchTimelineByAccountId, fetchTimelineByProjectId, fetchWorkflowRunsHeatmap, runWorkflow } from "@infrastructure/dependencies"
import { Request, Response } from "express"

export class WorkflowController {

    constructor() {}

    async fetchTimelineByProjectId(req: Request, res: Response): Promise<void> {
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

        try {
            const activities: WorkflowRun[] = await fetchTimelineByProjectId.execute(projectId, pagination)
            res.json(activities)
        } catch (error) {
            console.error("Error during fetching timeline by projectId:", error)
            res.status(500).json({ error: "Internal server error" })
        }
        
    }

    async fetchTimelineByAccountId(req: Request, res: Response): Promise<void> {
        const accountId = req.query.accountId as string
        const page = req.query.page as string
        const size = req.query.size as string

        if (!accountId || !page || !size) {
            res.status(400).json({ error: "Missing required parameters" })
            return
        }
        
        const pagination = {
            pageNumber: parseInt(page),
            pageSize: parseInt(size)
        }
        
        try {
            const activities: WorkflowRun[] = await fetchTimelineByAccountId.execute(accountId, pagination)
            res.json(activities)
        } catch (error) {
            console.error("Error during fetching timeline by accountId:", error)
            res.status(500).json({ error: "Internal server error" })
        }
        
    }
    async fetchHeatmap(req: Request, res: Response): Promise<void> {
        const accountId = req.query.accountId as string
        const startDate = req.query.startDate as string
        const endDate = req.query.endDate as string

        if (!accountId || !startDate || !endDate) {
            res.status(400).json({ error: "Missing required parameters" })
            return
        }

        try {
            const heatmap: WorkflowRunHeatmap[] = await fetchWorkflowRunsHeatmap.execute(accountId, { startDate, endDate })
            res.status(200).json(heatmap)
        } catch (error) {
            console.error("Error during fetching heatmap:", error)
            res.status(500).json({ error: "Internal server error" })
        }
    }

    async runWorkflow(req: Request, res: Response): Promise<void> {
        
        const taskId = req.body.taskId
        const workflowId = req.body.workflowId
        const accountId = req.body.accountId

        console.log("Received workflowId:", workflowId, "Type:", typeof workflowId)
        console.log("Running frontend development workflow for task:", taskId, "and account:", accountId)
        if (!taskId || !accountId) {
            res.status(400).json({ error: "Missing required parameters" })
            return
        }

		try {
            await runWorkflow.execute(taskId, workflowId, accountId)
            res.status(200).json({ message: "Workflow run initiated" })
		} catch (error) {
			console.error("Error during development workflow:", error)
            res.status(500).json({ error: "Internal server error" })
		}

    }
    
}