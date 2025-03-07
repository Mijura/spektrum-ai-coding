import { CodeGenerationWorkflow } from "@domain/workflows/code-generation"
import { ProjectDetails } from "@domain/entities/project-details"
import { Annotation, END, START, StateGraph } from "@langchain/langgraph"
import { BaseMessage } from "@langchain/core/messages"
import { ProjectDto } from "@application/dto/project"
import { SourceCodeDto } from "@application/dto/source-code"
import { productOwner } from "./nodes/product-owner"
import { reactDeveloper } from "./nodes/react-developer"
import { uiUxDesigner } from "./nodes/uiux-designer"
import { updateCode } from "./nodes/update-code"
import { updateProjectDetails } from "./nodes/update-project-details"
import { FrontendDevelopmentService } from "@application/services/fronted-development"

export const RootAnnotation = Annotation.Root({
	messages: Annotation<BaseMessage[]>({
		reducer: (x, y) => x.concat(y),
		default: () => [],
	}),
	userRequest: Annotation<string>(),
	ticket: Annotation<string>({
		reducer: (a: any, b: any) => b,
	}),
	projectDetails: Annotation<ProjectDto>({
		reducer: (a: any, b: any) => b,
	}),
	sourceCode: Annotation<SourceCodeDto>({
		reducer: (a: any, b: any) => b,
	}),
	projectId: Annotation<string>,
	frontendDevelopmentService: Annotation<FrontendDevelopmentService>
})

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

		const finalState = await workflow.invoke({
			userRequest: message,
			projectDetails: projectDetails,
			frontendDevelopmentService: this.frontendDevelopmentService
		})

		return finalState.projectDetails
	}
}
