import { InitializeReactModuleRequest, InitializeReactModuleUseCase } from "@app/ports/use-cases/initialize-react-module"
import { extractAuthData } from "@heksagon/http"
import { Request, Response } from "express"

export function createInitializeReactModuleController(initializeReactModuleUseCase: InitializeReactModuleUseCase) {
	return async (req: Request, res: Response): Promise<void> => {
		const projectId = req.body.projectId
		if (!projectId) {
			throw new Error(`Project id is required`)
		}

		const auth = extractAuthData(req.headers)
		try {
			const params: InitializeReactModuleRequest = {
				projectId: projectId
			}
			const module = await initializeReactModuleUseCase.execute(auth, params)
			res.status(201).json(module)
		} catch (error) {
			console.error("Error during react project initialization:", error)
			res.status(500).json({ error: "Internal server error" })
		}
	}
}