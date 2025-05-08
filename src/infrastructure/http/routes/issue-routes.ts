import { issueController } from "@infrastructure/dependencies"
import express, { Request, Response } from "express"

const router = express.Router()

router.post("/issue", (req: Request, res: Response) => issueController.createIssue(req, res))

router.put("/issue/title", (req: Request, res: Response) => issueController.updateIssueTitle(req, res))

router.put("/issue/description", (req: Request, res: Response) => issueController.updateIssueDescription(req, res))

router.get("/issue/fetch-all/:projectId", (req: Request, res: Response) => issueController.fetchIssues(req, res))

router.post("/issue/add-comment-and-run-workflow", (req: Request, res: Response) => issueController.leaveCommentAndRunPrototypingWorkflow(req, res))

export { router as issueRouter }