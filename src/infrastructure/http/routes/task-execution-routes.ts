import { taskExecutionController } from "@infrastructure/dependencies"
import express, { Request, Response } from "express"

const router = express.Router()

router.post("/task-execution/develop", (req: Request, res: Response) => taskExecutionController.develop(req, res))

router.post("/task-execution/comment-and-develop", (req: Request, res: Response) => taskExecutionController.commentAndDevelop(req, res))

export { router as taskExecutionRouter }