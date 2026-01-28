import { aiCodingController } from "@infra/dependencies"
import express, { Request, Response } from "express"

const router = express.Router()

router.post("/module/initialization", (req: Request, res: Response) =>
	aiCodingController.initializeReactModule(req, res),
)

router.post("/module/development", (req: Request, res: Response) => 
    aiCodingController.develop(req, res)
)

router.post("/module/deployment", (req: Request, res: Response) => 
    aiCodingController.deployToProduction(req, res)
)

export { router as aiCodingRoutes }
