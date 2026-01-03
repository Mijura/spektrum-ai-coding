import { develop } from "@infrastructure/dependencies"
import { Task } from "@jigjoy-io/task-contracts"
import { Request, Response } from "express"

export class AICodingController {

    async develop(req: Request, res: Response): Promise<void> {
        
        const task: Task = JSON.parse(req.body)

		try {
            await develop.execute(task)
            res.status(200).json({ message: "Task developed successfully" })
		} catch (error) {
			console.error("Error during task execution:", error)
            res.status(500).json({ error: "Internal server error" })
		}

    }
    
}