// src/infrastructure/web/controllers/ProjectController.ts
import express, { Request, Response, NextFunction } from "express"
import { ProjectService } from "@domain/services/project-service"
import { UserRequestDto } from "src/application/dto/user-request"
import { createNewProject, fetchProjectDetails, runWorkflow } from "@infrastructure/config/dependencies"


export class ProjectController {

	constructor(
		private readonly projectService: ProjectService
	) {}

	async createProject(req: Request, res: Response): Promise<void> {
		try {
			const project = await createNewProject.execute()
			res.status(201).json({ project })
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: "Error creating project." })
		}
	}

	async fetchProject(req: Request, res: Response): Promise<any> {
		try {
			const { projectId } = req.params
			const project = await fetchProjectDetails.execute(projectId)
			if (!project) {
				return res.status(404).json({ message: "Project not found" })
			}
			res.json(project)
		} catch (error) {
			res.status(500).json({ message: "Error fetching project" })
		}
	}

	async runWorkflow(req: Request, res: Response): Promise<void> {

		try {
			const userRequest: UserRequestDto = req.body

			console.log(userRequest)
			await runWorkflow.execute(userRequest)
			res.json({ message: "Worfklow successfully executed." })
		} catch (error) {
			console.error("Error rebuilding project:", error)
			res.status(500).json({ error: `Error rebuilding project: ${error}` })
		}
	}


    // Serve static project files
    async serveStaticFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const projectPath = await this.projectService.getStaticFilesPath(req.params.id);
            if (projectPath) {
                express.static(projectPath)(req, res, next);
            } else {
                res.status(404).send("Project not found");
            }
        } catch (error) {
            next(error);
        }
    }

    // Serve index.html
    async serveIndexHtml(req: Request, res: Response): Promise<void> {
        try {
            const indexPath = await this.projectService.getIndexFilePath(req.params.id);
            if (indexPath) {
                res.sendFile(indexPath);
            } else {
                res.status(404).send("Project not found");
            }
        } catch (error) {
            res.status(500).json({ message: "Error serving index.html" });
        }
    }

}
