import { projectController } from "@infrastructure/config/dependencies"
import express, { NextFunction, Request, Response } from "express"

const router = express.Router()


router.post("/new", (req: Request, res: Response) => projectController.createProject(req, res))

router.get("/fetch/:id", (req: Request, res: Response) => projectController.fetchProject(req, res))

router.put("/workflow/run", async (req: Request, res: Response) => projectController.runWorkflow(req, res))

export { router }
