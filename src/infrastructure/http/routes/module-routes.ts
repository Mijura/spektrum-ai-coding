import { moduleController } from "@infrastructure/dependencies"
import express, { Request, Response } from "express"

const router = express.Router()

router.post("/initialize-react-module", (req: Request, res: Response) =>
	moduleController.initializeReactModule(req, res),
)

router.post("/deploy-to-production", (req: Request, res: Response) => moduleController.deployToProduction(req, res))

export { router as moduleRoutes }
