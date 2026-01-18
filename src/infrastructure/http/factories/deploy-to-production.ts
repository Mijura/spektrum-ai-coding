import { DeployToProductionUseCase } from "@app/ports/use-cases/deploy-to-production"
import { Request, Response } from "express"

export function createDeployToProductionController(deployToProductionUseCase: DeployToProductionUseCase) {
	return async (req: Request, res: Response): Promise<void> => {
		const projectId = req.body.projectId
		if (!projectId) {
			throw new Error(`Project id is required`)
		}
		try {
			const entryPoint = await deployToProductionUseCase.execute(projectId)
			res.status(200).json(entryPoint)
		} catch (error) {
			console.error("Error during deployment to production:", error)
			res.status(500).json({ error: "Internal server error" })
		}
	}
}