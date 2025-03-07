import { Request, Response } from "express"
import { FrontendDevelopmentService } from "@application/services/fronted-development"
import { createNewProject, fetchProjectDetails, developUserRequest } from "@infrastructure/config/dependencies"

export class ProjectController {
	constructor(private readonly frontendDevelopmentService: FrontendDevelopmentService) {}

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

	async develop(req: Request, res: Response): Promise<void> {
		try {

			const { projectId, message } = req.body

			await developUserRequest.execute(projectId, message)
			res.json({ message: "Worfklow successfully executed." })
		} catch (error) {
			console.error("Error rebuilding project:", error)
			res.status(500).json({ error: `Error rebuilding project: ${error}` })
		}
	}

	async serveProject(req: Request, res: Response): Promise<void> {
		try {
			const indexPath = await this.frontendDevelopmentService.getIndexFilePath(req.params.id)
			if (indexPath) {
				res.sendFile(indexPath)
			} else {
				res.status(404).send("Project not found")
			}
		} catch (error) {
			res.status(500).json({ message: "Error serving index.html" })
		}
	}
}
