// src/infrastructure/web/routes/projectRoutes.ts
import express, { NextFunction, Request, Response } from "express"
import { ProjectController } from "../controllers/project-controller"

const router = express.Router()
const projectController = new ProjectController()

router.post("/new", (req: Request, res: Response) => projectController.createProject(req, res))

router.get("/fetch/:id", (req: Request, res: Response) => projectController.fetchProject(req, res))

router.put("/implement", async (req: Request, res: Response) => {
    
})

// Middleware to serve static files
router.use("/:id", (req: Request, res: Response, next: NextFunction) => {
    const projectPath = path.resolve(`projects/${req.params.id}/dist`)

    if (fs.existsSync(projectPath)) {
        express.static(projectPath)(req, res, next)
    } else {
        res.status(404).send("Project not found")
    }
})

// Serve index.html when accessing `/id`
router.get("/:id", (req: Request, res: Response) => {
    const projectPath = path.resolve(`projects/${req.params.id}/dist/index.html`)

    if (fs.existsSync(projectPath)) {
        res.sendFile(projectPath)
    } else {
        res.status(404).send("Project not found")
    }
})

export { router }
