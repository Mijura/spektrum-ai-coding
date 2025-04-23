import { projectController } from "@infrastructure/dependencies"
import express, { Request, Response } from "express"

const router = express.Router()

router.post("/", (req: Request, res: Response) => projectController.createProject(req, res))

router.put("/", (req: Request, res: Response) => projectController.updateProjectDetails(req, res))

router.get("/fetch/:projectId", (req: Request, res: Response) => projectController.fetchProject(req, res))

router.get("/fetch-all/:ownerId", (req: Request, res: Response) => projectController.fetchProjects(req, res))

router.put("/deploy", (req: Request, res: Response) => projectController.deployProject(req, res))

router.put("/archive", (req: Request, res: Response) => projectController.archiveProject(req, res))

export { router as projectRouter }