import { aiCodingController } from "@infra/dependencies"
import express, { Request, Response } from "express"

const router = express.Router()

router.post("/develop", (req: Request, res: Response) => aiCodingController.develop(req, res))

export { router as aiCodingRoutes }
