import { Project } from "@domain/entities/project"
import { RunWorkflowUseCase } from "@domain/use-cases/run-workflow-use-case"
import { ProjectStorage } from "@domain/persistence/project-storage"
import { Workflow } from "@domain/entities/workflow"
import EventEmitter from "events"
import { WorkflowFactory } from "@domain/utils/workflow-factory"
import { TicketStorage } from "@domain/persistence/ticket-storage"

export class RunWorkflow extends EventEmitter implements RunWorkflowUseCase {

	private readonly workflow: Workflow

	constructor(
		private readonly workflowId: string,
		private readonly projectStorage: ProjectStorage,
		private readonly ticketStorage: TicketStorage
	) {
		super()

		this.workflow = WorkflowFactory.create(this.workflowId)
		// listeners are placed in the constructor so they are attached once
		this.workflow.on("update", (data: any) => {
			this.emit("update", data)
		})

		this.workflow.on("done", (data: any) => {
			this.emit("done", data)
		})
	}

	async run(projectId: string, ticketId: string): Promise<Project> {
		const project = await this.projectStorage.findById(projectId)
		const ticket = await this.ticketStorage.findById(ticketId)
		if (!project) {
			throw new Error("Project not found")
		}
		if (!ticket) {
			throw new Error("Ticket not found")
		}

		return await this.workflow.run(project, ticket)
	}
}
