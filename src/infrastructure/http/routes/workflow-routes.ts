import { workflowRunController } from "@infrastructure/dependencies"
import express, { Request, Response } from "express"

const router = express.Router()

router.post("/workflow/run", (req: Request, res: Response) => workflowRunController.runWorkflow(req, res))

router.get("/workflow/project/timeline", (req: Request, res: Response) => workflowRunController.fetchTimelineByProjectId(req, res))

router.get("/workflow/account/timeline", (req: Request, res: Response) => workflowRunController.fetchTimelineByAccountId(req, res))

router.get("/workflow/heatmap", (req: Request, res: Response) => workflowRunController.fetchHeatmap(req, res))

export { router as workflowRouter }