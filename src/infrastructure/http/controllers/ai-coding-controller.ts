import { develop } from "@infrastructure/dependencies"
import { Request, Response } from "express"

export class AICodingController {

    async develop(req: Request, res: Response): Promise<void> {
        
        const task = req.body.task
        const chatHistory = req.body.chatHistory
        const projectId = req.body.projectId

		try {
            await develop.execute(task, chatHistory, projectId)
            res.status(200).json({ message: "Workflow run initiated" })
		} catch (error) {
			console.error("Error during task execution:", error)
            res.status(500).json({ error: "Internal server error" })
		}

    }
    
}