import { Project } from "@domain/entities/project"
import { DevelopUserRequestUseCase } from "@domain/use-cases/develop-user-request-use-case"
import { ProjectStorage } from "@domain/persistence/project-storage"
import { CodeGenerationWorkflow } from "@domain/workflows/code-generation"
import EventEmitter from "events"

export class DevelopUserRequest extends EventEmitter implements DevelopUserRequestUseCase {
	constructor(
		private readonly projectStorage: ProjectStorage,
		private readonly codeGenerationWorkflow: CodeGenerationWorkflow
	) {
		super()

		// Move listeners to constructor (so they are attached once)
		this.codeGenerationWorkflow.on("update", (data: any) => {
			console.log(`update event emitted: ${JSON.stringify(data)}`)
			this.emit("update", data)
		})

		this.codeGenerationWorkflow.on("done", (data: any) => {
			console.log(`done event emitted: ${JSON.stringify(data)}`)
			this.emit("done", data)
		})
	}

	async execute(projectId: string, message: string): Promise<Project> {
		const project = await this.projectStorage.findById(projectId)
		if (!project) {
			throw new Error("Project not found")
		}

		return await this.codeGenerationWorkflow.execute(project, message)
	}
}
