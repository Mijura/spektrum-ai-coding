import { CodeGenerationWorkflow } from "@domain/workflows/code-generation"
import { Project } from "@domain/entities/project"
import { END, START, StateGraph } from "@langchain/langgraph"
import { productOwner } from "./nodes/product-owner"
import { reactDeveloper } from "./nodes/react-developer"
import { uiUxDesigner } from "./nodes/uiux-designer"
import { updateCode } from "./nodes/update-code"
import { updateProject } from "./nodes/update-project-details"
import { FrontendDevelopmentService } from "@application/services/fronted-development"
import { RootAnnotation } from "./state/root-annotation"
import { EventEmitter } from "events"
export class LangGraphCodeGeneration extends EventEmitter implements CodeGenerationWorkflow {
	constructor(private readonly frontendDevelopmentService: FrontendDevelopmentService) {
		super()
	}

	async execute(project: Project, message: string): Promise<Project> {
		const workflow = new StateGraph({
			input: RootAnnotation,
			output: RootAnnotation,
		})
			.addNode("ProductOwner", productOwner)
			.addNode("ReactDeveloper", reactDeveloper)
			.addNode("UiUxDesigner", uiUxDesigner)
			.addNode("updateCode", updateCode)
			.addNode("updateProject", updateProject)
			.addEdge(START, "ProductOwner")
			.addEdge("ProductOwner", "UiUxDesigner")
			.addEdge("UiUxDesigner", "ReactDeveloper")
			.addEdge("ReactDeveloper", "updateCode")
			.addEdge("updateCode", "updateProject")
			.addEdge("updateProject", END)
			.compile()

		for await (const chunk of await workflow.stream(
			{
				userRequest: message,
				project: project,
				frontendDevelopmentService: this.frontendDevelopmentService,
			},
			{ streamMode: ["values", "custom", "updates"] }
		)) {
			for (const [node, values] of Object.entries(chunk)) {
				console.log(`Receiving update from node: ${node}`)
				console.log(values)
				console.log("\n====\n")
				const update = { node, values }
				this.emit("update", update)
			}
		}

		this.emit("done", project)

		return project
	}
}
