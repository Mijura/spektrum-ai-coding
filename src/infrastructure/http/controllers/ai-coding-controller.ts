import { developModuleUseCase, deployToProductionUseCase, initializeReactModuleUseCase } from "@infra/dependencies"
import { Request, Response } from "express"
import { createDevelopController } from "@infra/http/factories/develop"
import { createDeployToProductionController } from "../factories/deploy-to-production"
import { createInitializeReactModuleController } from "../factories/initialize-react-module"

export class AICodingController {
	async develop(req: Request, res: Response): Promise<void> {
		createDevelopController(developModuleUseCase).bind(this)(req, res)
	}

	async initializeReactModule(req: Request, res: Response): Promise<void> {
		createInitializeReactModuleController(initializeReactModuleUseCase).bind(this)(req, res)
	}

	async deployToProduction(req: Request, res: Response): Promise<void> {
		createDeployToProductionController(deployToProductionUseCase).bind(this)(req, res)
	}
}