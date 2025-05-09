import { workflowRunController } from "@infrastructure/dependencies"
import express, { Request, Response } from "express"

const router = express.Router()

router.post("/workflow-run/prototyping", (req: Request, res: Response) => workflowRunController.triggerPrototypingWorkflow(req, res))

router.get("/workflow-run/project/timeline", (req: Request, res: Response) => workflowRunController.fetchTimelineByProjectId(req, res))

router.get("/workflow-run/account/timeline", (req: Request, res: Response) => workflowRunController.fetchTimelineByAccountId(req, res))

router.get("/workflow-run/heatmap", (req: Request, res: Response) => workflowRunController.fetchHeatmap(req, res))

export { router as workflowRunRouter }