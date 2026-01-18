import { deployToProduction, initializeReactModule } from "@infra/dependencies"
import { Request, Response } from "express"
import { createInitializeReactModuleController } from "@infra/http/factories/initialize-react-module"
import { createDeployToProductionController } from "../factories/deploy-to-production"

export class ModuleController {
	async initializeReactModule(req: Request, res: Response): Promise<void> {
		createInitializeReactModuleController(initializeReactModule).bind(this)(req, res)
	}

	async deployToProduction(req: Request, res: Response): Promise<void> {
		createDeployToProductionController(deployToProduction).bind(this)(req, res)
	}
}
