import { Workflow } from "@domain/entities/workflow"
import { Project } from "@domain/entities/project"
import { END, START, StateGraph } from "@langchain/langgraph"
import { Ticket } from "@domain/entities/ticket"
import { RootAnnotation } from "./root-annotation"
import { productOwner } from "./nodes/product-owner"
import { reactDeveloper } from "./nodes/react-developer"
import { updateCode } from "./nodes/update-code"
import { updateProject } from "./nodes/update-project"
import { FrontendDevelopmentService } from "@domain/services/frontend-development"
import { uiUxDesigner } from "./nodes/uiux-designer"
export class LangGraphCodeGeneration extends Workflow {

	constructor(private readonly frontendDevelopmentService: FrontendDevelopmentService) {
		super()
	}

	async run(project: Project, ticket: Ticket): Promise<Project> {
		
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
			.addNode("UiUxDesigner", uiUxDesigner)
			.addNode("updateCode", updateCode)
			.addNode("updateProject", updateProject)
			.addEdge(START, "ProductOwner")
			//.addEdge("ProductOwner", "UiUxDesigner")
			.addEdge("ProductOwner", "UiUxDesigner")
			.addEdge("UiUxDesigner", "ReactDeveloper")
			.addEdge("ReactDeveloper", "updateCode")
			.addEdge("updateCode", "updateProject")
			.addEdge("updateProject", END)
			.compile()

		for await (const chunk of await workflow.stream(
			{
				ticket: ticket,
				project: project,
				frontendDevelopmentService: this.frontendDevelopmentService,
			},
			{ streamMode: "updates" }
		)) {
			for (const [node, values] of Object.entries(chunk)) {

				let message = (values as any).message
				const update = { node, message }

				this.emit("update", update)
			}
		}

		this.emit("done", project)

		return project
	}
}
