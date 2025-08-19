import { TaskExecution } from "@domain/entities/task-execution"
import { TaskExecutionHeatmap } from "@domain/value-objects/task-execution"
import { fetchTimelineByAccountId, fetchTimelineByProjectId, fetchTaskExecutionsHeatmap, leaveComment, develop } from "@infrastructure/dependencies"
import { Request, Response } from "express"

export class TaskExecutionController {

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
            const activities: TaskExecution[] = await fetchTimelineByProjectId.execute(projectId, pagination)
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
            const activities: TaskExecution[] = await fetchTimelineByAccountId.execute(accountId, pagination)
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
            const heatmap: TaskExecutionHeatmap[] = await fetchTaskExecutionsHeatmap.execute(accountId, { startDate, endDate })
            res.status(200).json(heatmap)
        } catch (error) {
            console.error("Error during fetching heatmap:", error)
            res.status(500).json({ error: "Internal server error" })
        }
    }

    async develop(req: Request, res: Response): Promise<void> {
        
        const taskId = req.body.taskId
        const accountId = req.body.accountId

        console.log("Received taskId:", taskId, "Type:", typeof taskId)
        console.log("Received accountId:", accountId, "Type:", typeof accountId)
        if (!taskId || !accountId) {
            res.status(400).json({ error: "Missing required parameters" })
            return
        }

		try {
            await develop.execute(taskId, accountId)
            res.status(200).json({ message: "Workflow run initiated" })
		} catch (error) {
			console.error("Error during task execution:", error)
            res.status(500).json({ error: "Internal server error" })
		}

    }

    async commentAndDevelop(req: Request, res: Response): Promise<void> {
		try {
			const { taskId, authorId, commentText } = req.body
			await leaveComment.execute(taskId, authorId, commentText)
            
			res.status(200).json({ message: "Comment added" })
		} catch (error) {
			console.error("Error adding comment:", error)
			res.status(500).json({ message: "Error adding comment." })
		}
	}
    
}