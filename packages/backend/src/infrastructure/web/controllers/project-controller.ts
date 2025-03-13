import { Request, Response } from "express"
import {
	createNewProject,
	fetchProject,
	deployProject,
	projectStorage,
	codeGenerationWorkflow,
} from "@infrastructure/config/dependencies"
import { DevelopUserRequestUseCase } from "@domain/use-cases/develop-user-request-use-case"
import { DevelopUserRequest } from "@application/use-cases/develop-user-request"

export class ProjectController {
	constructor() {}

	async createProject(req: Request, res: Response): Promise<void> {
		try {
			const project = await createNewProject.execute()
			res.status(201).json(project)
		} catch (error) {
			console.error("Error creating project:", error)
			res.status(500).json({ message: "Error creating project." })
		}
	}

	async fetchProject(req: Request, res: Response): Promise<any> {
		try {
			const { projectId } = req.params
			const project = await fetchProject.execute(projectId)
			if (!project) {
				return res.status(404).json({ message: "Project not found" })
			}
			res.json(project)
		} catch (error) {
			console.error("Error fetching project:", error)
			res.status(500).json({ message: "Error fetching project" })
		}
	}

	async develop(req: Request, res: Response): Promise<void> {
		try {
			const { projectId, message } = req.body

			const developUserRequest = new DevelopUserRequest(projectStorage, codeGenerationWorkflow)
			// Stream updates
			developUserRequest.on("update", (data) => {
				console.log(`Streaming update: ${JSON.stringify(data)}`)
				res.write(`data: ${JSON.stringify(data)}\n\n`)
			})

			// Stream final state
			developUserRequest.on("done", (finalProject) => {
				console.log(`Streaming final result: ${JSON.stringify(finalProject)}`)
				res.write(`event: final\ndata: ${JSON.stringify(finalProject)}\n\n`)
				res.end()
			})

			// Handle client disconnect
			req.on("close", () => {
				console.log("Client disconnected, removing listeners...")
				developUserRequest.removeAllListeners("update")
				developUserRequest.removeAllListeners("done")
			})

			// 🔹 Debug: Ensure execution starts
			console.log("Starting code generation workflow...")
			await developUserRequest.execute(projectId, message)

		} catch (error) {
			console.error("Error rebuilding project:", error)
			res.status(500).json({ error: `Error rebuilding project: ${error}` })
		}
	}

	async deploy(req: Request, res: Response): Promise<void> {
		try {
			const { projectId } = req.body

			const project = await deployProject.execute(projectId)
			res.status(200).json(project)
		} catch (error) {
			console.error("Error rebuilding project:", error)
			res.status(500).json({ error: `Error rebuilding project: ${error}` })
		}
	}
}
