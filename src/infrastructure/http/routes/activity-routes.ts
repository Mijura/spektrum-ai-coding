import { activityController } from "@infrastructure/dependencies"
import express, { Request, Response } from "express"

const router = express.Router()

router.get("/activities/:issueId", (req: Request, res: Response) => activityController.fetchActivities(req, res))

router.get("/activities/:issueId/workflow-run-timeline", (req: Request, res: Response) => activityController.fetchActivitiesByType(req, res))

export { router as activityRouter }