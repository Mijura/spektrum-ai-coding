import { Request, Response } from "express"
import { createNewProject, fetchProject, deployProject, developUserRequest, fetchAllProjects } from "@infrastructure/config/dependencies"
import { ProjectMapper } from "@domain/mappers/project-mapper"

export class ProjectController {

	constructor() {}

	async createProject(req: Request, res: Response): Promise<void> {
		try {
			const { owner } = req.body
			const project = await createNewProject.execute(owner)
			res.status(201).json(project)
		} catch (error) {
			console.error("Error creating project:", error)
			res.status(500).json({ message: "Error creating project." })
		}
	}

	async fetchProject(req: Request, res: Response): Promise<void> {
		try {
			const { projectId } = req.params
			const project = await fetchProject.execute(projectId)
			const projectDTO = ProjectMapper.toDto(project)
			res.json(projectDTO)
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error fetching project:", error)
			res.status(500).json({ message: "Error fetching project" })
		}
	}

	async fetchAllProjects(req: Request, res: Response): Promise<any> {

		try {
			const { ownerId } = req.params
			console.log(`Fetching all projects for ${ownerId}`)
			const projects = await fetchAllProjects.execute(ownerId)
			const projectDTO = ProjectMapper.toDtos(projects)
			res.json(projectDTO)
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error fetching project:", error)
			res.status(500).json({ message: "Error fetching project" })
		}

    }

	async develop(req: Request, res: Response): Promise<void> {
		try {
			const { projectId, message } = req.body

			// Ensure that the request is executed before response ends
			await developUserRequest.execute(projectId, message)

			// Stream updates
			const sendUpdate = (data: any) => {
				console.log(`Streaming update: ${JSON.stringify(data)}`)
				res.write(`data: ${JSON.stringify(data)}\n\n`)
			}

			// Stream final state
			const sendFinal = (finalProject: any) => {
				console.log(`Streaming final result: ${JSON.stringify(finalProject)}`)
				res.write(`event: final\ndata: ${JSON.stringify(finalProject)}\n\n`)
				res.end()
			}

			// Add event listeners
			developUserRequest.on("update", sendUpdate)
			developUserRequest.on("done", sendFinal)

			// Handle client disconnect
			req.on("close", () => {
				console.log("Client disconnected, removing listeners...")
				developUserRequest.off("update", sendUpdate)
				developUserRequest.off("done", sendFinal)
			})
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
