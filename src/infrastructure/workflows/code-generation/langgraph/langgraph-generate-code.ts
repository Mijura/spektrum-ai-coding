import { Workflow } from "@domain/entities/workflow"
import { Project } from "@domain/entities/project"
import { END, START, StateGraph } from "@langchain/langgraph"
import { productOwner } from "./nodes/product-owner"
import { reactDeveloper } from "./nodes/react-developer"
import { uiUxDesigner } from "./nodes/uiux-designer"
import { updateCode } from "./nodes/update-code"
import { updateProject } from "./nodes/update-project-details"
import { FrontendDevelopmentService } from "@application/services/fronted-development"
import { RootAnnotation } from "./state/root-annotation"
import { ProjectMapper } from "@domain/mappers/project-mapper"
import { principalDeveloper } from "./nodes/principal-js-developer"
export class LangGraphCodeGeneration extends Workflow {

	constructor(private readonly frontendDevelopmentService: FrontendDevelopmentService) {
		super()
	}

	async run(project: Project, message: string): Promise<Project> {
		
		const workflow = new StateGraph({
			input: RootAnnotation,
			output: RootAnnotation,
		})
			.addNode("ProductOwner", productOwner)
			.addNode("PrincipalDeveloper", principalDeveloper)
			.addNode("ReactDeveloper", reactDeveloper)
			.addNode("UiUxDesigner", uiUxDesigner)
			.addNode("updateCode", updateCode)
			.addNode("updateProject", updateProject)
			.addEdge(START, "ProductOwner")
			.addEdge("ProductOwner", "UiUxDesigner")
			.addEdge("UiUxDesigner", "PrincipalDeveloper")
			.addEdge("PrincipalDeveloper", "ReactDeveloper")
			.addEdge("ReactDeveloper", "updateCode")
			.addEdge("updateCode", "updateProject")
			.addEdge("updateProject", END)
			.compile()

		for await (const chunk of await workflow.stream(
			{
				userRequest: message,
				project: ProjectMapper.toDto(project),
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
