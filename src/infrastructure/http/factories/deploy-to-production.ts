import { DeployToProductionRequest, DeployToProductionUseCase } from "@app/ports/use-cases/deploy-to-production"
import { extractAuthData } from "@heksagon/http"
import { Request, Response } from "express"

export function createDeployToProductionController(deployToProductionUseCase: DeployToProductionUseCase) {
	return async (req: Request, res: Response): Promise<void> => {
		const projectId = req.body.projectId
		if (!projectId) {
			throw new Error(`Project id is required`)
		}

		const auth = extractAuthData(req)
		try {

			const params: DeployToProductionRequest = {
				projectId: projectId
			}
			const entryPoint = await deployToProductionUseCase.execute(auth, params)
			res.status(200).json(entryPoint)
		} catch (error) {
			console.error("Error during deployment to production:", error)
			res.status(500).json({ error: "Internal server error" })
		}
	}
}