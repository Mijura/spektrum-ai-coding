import express, { Request, Response, NextFunction } from "express"
import { projectService } from "@infrastructure/config/dependencies"

export async function serveProjectFilesMiddleware(req: Request, res: Response, next: NextFunction) {

    const projectPath = await projectService.getStaticFilesPath(req.params.id)

	if (projectPath) {
		express.static(projectPath)(req, res, next)
	} else {
		res.status(404).send("Project not found")
	}
}