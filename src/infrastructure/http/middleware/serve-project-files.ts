import { frontendDevelopmentService } from "@infrastructure/dependencies"
import express, { Request, Response, NextFunction } from "express"

export async function serveProjectFilesMiddleware(req: Request, res: Response, next: NextFunction) {

    const projectPath = await frontendDevelopmentService.getStaticFilesPath(req.params.id)

	if (projectPath) {
		express.static(projectPath)(req, res, next)
	} else {
		res.status(404).send("Project not found")
	}
}