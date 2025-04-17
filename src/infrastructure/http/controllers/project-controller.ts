import { Request, Response } from "express"
import { ProjectDtoMapper } from "@application/mappers/project-dto-mappers"
import { createNewProject, fetchProject, deployProject, fetchProjects, archiveProject } from "@infrastructure/dependencies"
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
			const projectDTO = ProjectDtoMapper.toDto(project)
			res.json(projectDTO)
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error fetching project:", error)
			res.status(500).json({ message: "Error fetching project" })
		}
	}

	async fetchProjects(req: Request, res: Response): Promise<any> {

		try {
			const { ownerId } = req.params
			console.log(`Fetching all projects for ${ownerId}`)
			const projects = await fetchProjects.execute(ownerId)
			const projectDtos = ProjectDtoMapper.toDtos(projects)
			res.json(projectDtos)
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error fetching projects:", error)
			res.status(500).json({ message: "Error fetching projects" })
		}

    }

	async archiveProject(req: Request, res: Response): Promise<void> {
		try {
			const { projectId } = req.body
			const project = await archiveProject.execute(projectId)
			res.json(project)
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error changing project status:", error)
			res.status(500).json({ message: "Error changing project status" })
		}
	}

	async deployProject(req: Request, res: Response): Promise<void> {
		try {
			const { projectId } = req.body

			const project = await deployProject.execute(projectId)
			res.status(200).json(project)
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error rebuilding project:", error)
			res.status(500).json({ error: `Error rebuilding project: ${error}` })
		}
	}
}
