import { develop } from "@infra/dependencies"
import { Request, Response } from "express"
import { createDevelopController } from "@infra/http/factories/develop"

export class AICodingController {
	async develop(req: Request, res: Response): Promise<void> {
		createDevelopController(develop).bind(this)(req, res)
	}
}