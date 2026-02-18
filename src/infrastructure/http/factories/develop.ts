import { DevelopUseCase } from "@app/ports/use-cases/develop"
import { Task } from "@jigjoy-ai/task-contracts"
import { Request, Response } from "express"

export function createDevelopController(developUseCase: DevelopUseCase) {
	return async (req: Request, res: Response): Promise<void> => {
		try {
			const { task, accountId } = req.body as { task: Task; accountId: string }

			if (!task || !accountId) {
				throw new Error("Task and accountId are required")
			}
			const totalCostInUSD = await developUseCase.execute(task, accountId)
			res.status(200).json({ totalCostInUSD })
		} catch (error) {
			console.error("Error during task execution:", error)
			res.status(500).json({ error: "Internal server error" })
		}
	}
}