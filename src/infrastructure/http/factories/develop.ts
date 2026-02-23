import { DevelopRequest, DevelopUseCase } from "@app/ports/use-cases/develop"
import { extractAuthData } from "@heksagon/http"
import { Task } from "@jigjoy-ai/task-contracts"
import { Request, Response } from "express"

export function createDevelopController(developUseCase: DevelopUseCase) {
	return async (req: Request, res: Response): Promise<void> => {
		try {
			const { task } = req.body as { task: Task }
			const auth = extractAuthData(req)
			if (!task) {
				throw new Error("Task is required")
			}

			const userId = req.headers["x-user-id"] as string
			if (!userId) {
				throw new Error("User ID is missing in the request headers")
			}

			const params: DevelopRequest = {
				task: task
			}

			const totalCostInUSD = await developUseCase.execute(auth, params)
			res.status(200).json({ totalCostInUSD })
		} catch (error) {
			console.error("Error during task execution:", error)
			res.status(500).json({ error: "Internal server error" })
		}
	}
}
