import { projectController } from "@infrastructure/config/dependencies"
import express, { Request, Response } from "express"

const router = express.Router()

router.post("/", (req: Request, res: Response) => projectController.createProject(req, res))

router.get("/fetch/:id", (req: Request, res: Response) => projectController.fetchProject(req, res))

router.put("/develop", (req: Request, res: Response) => projectController.develop(req, res))

router.get("/:id", (req: Request, res: Response) => projectController.serveProject(req, res))

export { router }