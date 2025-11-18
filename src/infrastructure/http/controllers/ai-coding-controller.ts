import { develop } from "@infrastructure/dependencies"
import { Request, Response } from "express"

export class AICodingController {

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
    
}