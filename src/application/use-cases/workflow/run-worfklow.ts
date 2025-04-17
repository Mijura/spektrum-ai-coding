import { Project } from "@domain/entities/project"
import { RunWorkflow } from "@domain/use-cases/workflow/run-workflow"
import { Workflow } from "@domain/entities/workflow"
import EventEmitter from "events"
import { WorkflowFactory } from "@domain/utils/workflow-factory"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { TicketRepository } from "@domain/repositories/ticket-repository"

export class RunWorkflowUseCase extends EventEmitter implements RunWorkflow {

	private readonly workflow: Workflow

	constructor(
		private readonly workflowId: string,
		private readonly projectRepository: ProjectRepository,
		private readonly ticketRepository: TicketRepository
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
		const project = await this.projectRepository.findById(projectId)
		const ticket = await this.ticketRepository.findById(ticketId)
		if (!project) {
			throw new Error("Project not found")
		}
		if (!ticket) {
			throw new Error("Ticket not found")
		}

		return await this.workflow.run(project, ticket)
	}
}
