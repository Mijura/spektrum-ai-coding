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
	}

	async execute(projectId: string, message: string): Promise<Project> {
		const project = await this.projectStorage.findById(projectId)
		if (!project) {
			throw new Error("Project not found")
		}

		// Listen to updates and forward them
		this.codeGenerationWorkflow.on("update", (data: any) => {
			console.log(`updateeeeeeeeeeee ${JSON.stringify(data)}`)
			this.emit("update", data)
		})

		// Capture final project details
		this.codeGenerationWorkflow.on("done", (data: any) => {
			console.log(`doneeeeeeeeeeeeeee ${JSON.stringify(data)}`)
			this.emit("done", data)
		})

		return await this.codeGenerationWorkflow.execute(project, message)
	}
}
