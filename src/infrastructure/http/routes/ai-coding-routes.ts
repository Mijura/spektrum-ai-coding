import { aiCodingController, moduleController } from "@infrastructure/dependencies"
import express, { Request, Response } from "express"

const router = express.Router()

router.post("/initialize-react-module", (req: Request, res: Response) =>
	moduleController.initializeReactModule(req, res),
)
router.post("/develop", (req: Request, res: Response) => aiCodingController.develop(req, res))

export { router as aiCodingRoutes }
