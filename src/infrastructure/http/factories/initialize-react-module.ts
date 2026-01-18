import { InitializeReactModuleUseCase } from "@app/ports/use-cases/initialize-react-module"
import { Request, Response } from "express"

export function createInitializeReactModuleController(initializeReactModuleUseCase: InitializeReactModuleUseCase) {
	return async (req: Request, res: Response): Promise<void> => {
		const projectId = req.body.projectId
		if (!projectId) {
			throw new Error(`Project id is required`)
		}

		try {
			const module = await initializeReactModuleUseCase.execute(projectId)
			res.status(201).json(module)
		} catch (error) {
			console.error("Error during react project initialization:", error)
			res.status(500).json({ error: "Internal server error" })
		}
	}
}