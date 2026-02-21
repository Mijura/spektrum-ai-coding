import { DevelopUseCase } from "@app/ports/use-cases/develop"
import { Task } from "@jigjoy-ai/task-contracts"
import { Request, Response } from "express"

export function createDevelopController(developUseCase: DevelopUseCase) {
	return async (req: Request, res: Response): Promise<void> => {
		try {
			const { task } = req.body as { task: Task }

			if (!task) {
				throw new Error("Task is required")
			}

			const userId = req.headers["x-user-id"] as string
			if (!userId) {
				throw new Error("User ID is missing in the request headers")
			}

			const totalCostInUSD = await developUseCase.execute(task, userId)
			res.status(200).json({ totalCostInUSD })
		} catch (error) {
			console.error("Error during task execution:", error)
			res.status(500).json({ error: "Internal server error" })
		}
	}
}
