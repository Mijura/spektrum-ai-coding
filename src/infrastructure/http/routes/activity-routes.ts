import { activityController } from "@infrastructure/dependencies"
import express, { Request, Response } from "express"

const router = express.Router()

router.get("/activities/workflow-run-timeline", (req: Request, res: Response) => activityController.fetchWorkflowRunTimeline(req, res))

router.get("/activities/issue/:issueId", (req: Request, res: Response) => activityController.fetchActivities(req, res))

export { router as activityRouter }