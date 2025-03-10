import { CodeGenerationWorkflow } from "@domain/workflows/code-generation"
import { ProjectDetails } from "@domain/model/project-details"
import { END, START, StateGraph } from "@langchain/langgraph"
import { productOwner } from "./nodes/product-owner"
import { reactDeveloper } from "./nodes/react-developer"
import { uiUxDesigner } from "./nodes/uiux-designer"
import { updateCode } from "./nodes/update-code"
import { updateProjectDetails } from "./nodes/update-project-details"
import { FrontendDevelopmentService } from "@application/services/fronted-development"
import { RootAnnotation } from "./state/root-annotation"
export class LangGraphCodeGeneration implements CodeGenerationWorkflow {


	constructor(private readonly frontendDevelopmentService: FrontendDevelopmentService) {}

	async execute(projectDetails: ProjectDetails, message: string): Promise<ProjectDetails> {
		const workflow = new StateGraph({
			input: RootAnnotation,
			output: RootAnnotation,
		})
			.addNode("ProductOwner", productOwner)
			.addNode("ReactDeveloper", reactDeveloper)
			.addNode("UiUxDesigner", uiUxDesigner)
			.addNode("updateCode", updateCode)
			.addNode("updateProjectDetails", updateProjectDetails)
			.addEdge(START, "ProductOwner")
			.addEdge("ProductOwner", "UiUxDesigner")
			.addEdge("UiUxDesigner", "ReactDeveloper")
			.addEdge("ReactDeveloper", "updateCode")
			.addEdge("updateCode", "updateProjectDetails")
			.addEdge("updateProjectDetails", END)
			.compile()



		for await (
			const chunk of await workflow.stream({
				userRequest: message,
				projectDetails: projectDetails,
				frontendDevelopmentService: this.frontendDevelopmentService
				},
				{ streamMode: ["values","custom", "updates"] })
		) {
			for (const [node, values] of Object.entries(chunk)) {
				console.log(`Receiving update from node: ${node}`);
				console.log(values);
				console.log("\n====\n");
			}
		}

		//const finalState = await workflow.invoke()

		return projectDetails
	}
}
