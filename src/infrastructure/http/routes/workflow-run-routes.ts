import { workflowRunController } from "@infrastructure/dependencies"
import express, { Request, Response } from "express"

const router = express.Router()

router.get("/workflow-run/timeline", (req: Request, res: Response) => workflowRunController.fetchTimeline(req, res))

export { router as workflowRunRouter }