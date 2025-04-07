import { Project } from "@domain/entities/project"
import { RunWorkflowUseCase } from "@domain/use-cases/run-workflow-use-case"
import { ProjectStorage } from "@domain/persistence/project-storage"
import { Workflow } from "@domain/entities/workflow"
import EventEmitter from "events"
import { WorkflowFactory } from "@domain/utils/workflow-factory"

export class RunWorkflow extends EventEmitter implements RunWorkflowUseCase {

	private readonly workflow: Workflow

	constructor(
		private readonly workflowId: string,
		private readonly projectStorage: ProjectStorage
	) {
		super()

		this.workflow = WorkflowFactory.getById(this.workflowId)
		// Move listeners to constructor (so they are attached once)
		this.workflow.on("update", (data: any) => {
			console.log(`update event emitted: ${JSON.stringify(data)}`)
			this.emit("update", data)
		})

		this.workflow.on("done", (data: any) => {
			console.log(`done event emitted: ${JSON.stringify(data)}`)
			this.emit("done", data)
		})
	}

	async run(projectId: string, message: string): Promise<Project> {
		const project = await this.projectStorage.findById(projectId)
		if (!project) {
			throw new Error("Project not found")
		}

		return await this.workflow.run(project, message)
	}
}
