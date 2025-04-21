import { Workflow } from "@domain/entities/workflow"
import { Project } from "@domain/entities/project"
import { END, START, StateGraph } from "@langchain/langgraph"
import { Ticket } from "@domain/entities/ticket"
import { RootAnnotation } from "./root-annotation"
import { productOwner } from "./nodes/product-owner"
import { reactDeveloper } from "./nodes/react-developer"
import { updateCode } from "./nodes/update-code"
import { TicketMapper } from "@infrastructure/mappers/ticket-mapper"
import { frontendDevelopmentService } from "@infrastructure/dependencies"

export class LangGraphCodeGeneration extends Workflow {

	constructor() {
		super()
	}

	async run(project: Project, ticket: Ticket): Promise<Project> {

		const sourceCode = await frontendDevelopmentService.fetchSourceCode(project.id)
		
		console.log(`Running workflow for project ${project.id} and ticket ${ticket.id}`)
		console.log(`Project: ${JSON.stringify(project)}`)
		console.log(`Ticket: ${JSON.stringify(ticket)}`)
		console.log(`--------------------------------`)
		const workflow = new StateGraph({
			input: RootAnnotation,
			output: RootAnnotation,
		})
			.addNode("ProductOwner", productOwner)
			//.addNode("PrincipalDeveloper", principalDeveloper)
			.addNode("ReactDeveloper", reactDeveloper)
			//.addNode("UiUxDesigner", uiUxDesigner)
			.addNode("updateCode", updateCode)
			.addEdge(START, "ProductOwner")
			//.addEdge("ProductOwner", "UiUxDesigner")
			.addEdge("ProductOwner", "ReactDeveloper")
			.addEdge("ReactDeveloper", "updateCode")
			.addEdge("updateCode", END)
			.compile()

		for await (const chunk of await workflow.stream(
			{
				ticket: ticket,
				project: project,
				sourceCode: sourceCode
			},
			{ streamMode: "updates" }
		)) {
			for (const [node, values] of Object.entries(chunk)) {

				let ticket = (values as any).ticket

				const update = { 
					node, 
					ticket: TicketMapper.toRecord(ticket) 
				}

				this.emit("update", update)
			}
		}

		this.emit("done", project)

		return project
	}
}
