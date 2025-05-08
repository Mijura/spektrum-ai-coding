import { taskController } from "@infrastructure/dependencies"
import express, { Request, Response } from "express"

const router = express.Router()

router.post("/task", (req: Request, res: Response) => taskController.createTask(req, res))

router.put("/task/title", (req: Request, res: Response) => taskController.updateTaskTitle(req, res))

router.put("/task/description", (req: Request, res: Response) => taskController.updateTaskDescription(req, res))

router.get("/task/fetch-all/:projectId", (req: Request, res: Response) => taskController.fetchTasks(req, res))

router.post("/task/add-comment-and-run-workflow", (req: Request, res: Response) => taskController.leaveCommentAndRunPrototypingWorkflow(req, res))

export { router as taskRouter }