// src/infrastructure/web/controllers/ProjectController.ts
import { Request, Response } from "express"
import { ProjectService } from "@domain/services/project-service"
import { CreateNewProject } from "src/application/use-cases/create-new-project"
import { FileSystemAdapter } from "src/infrastructure/adapters/file-system-adapter"
import { YarnPackageManager } from "src/infrastructure/adapters/yarn-package-manager"
import { DynamoDBProjectRepository } from "src/infrastructure/adapters/persistence/project-repository-dynamodb"
import { RspackTemplateService } from "src/infrastructure/adapters/rspack-template-service"
import { FetchProjectDetails } from "src/application/use-cases/fetch-project-details"
import { ChangeRequestDto } from "src/application/dto/change-request"
import { implementChangeRequest } from "src/application/use-cases/implement-request"

// You may need to initialize these dependencies using dependency injection or a service container.
const fileSystemAdapter = new FileSystemAdapter()
const templateService = new RspackTemplateService(fileSystemAdapter)
const yarnPackageManager = new YarnPackageManager()
const projectRepository = new DynamoDBProjectRepository()

const projectService = new ProjectService(templateService, yarnPackageManager)
const createNewProject = new CreateNewProject(projectService, projectRepository)
const fetchProjectDetails = new FetchProjectDetails(projectRepository)
const implementChangeRequest = new implementChangeRequest(projectRepository)

export class ProjectController {
	// This controller method handles the request to create a new project.
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

	async implementChangeRequest(req: Request, res: Response): Promise<void> {
		// Implement the change request
		try {
			const changeRequest: ChangeRequestDto = req.body

			console.log(changeRequest)
			await implementChangeRequest.execute(changeRequest)
			res.json({ message: "Feacture successfully implemented." })
		} catch (error) {
			console.error("Error rebuilding project:", error)
			res.status(500).json({ error: `Error rebuilding project: ${error}` })
		}
	}
}
