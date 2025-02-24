import { Annotation, StateGraph, START, END } from "@langchain/langgraph"
import { productOwner } from "./agents/product-owner"
import { reactDeveloper } from "./agents/react-developer"
import { uiUxDesigner } from "./agents/uiux-designer"
import { graphicDesigner } from "./agents/graphic-designer"
import { ChangeRequestDto, ProjectDto, SourceCode } from "../dto/project"

// Define Root Annotation with Reducer
export const RootAnnotation = Annotation.Root({
	userRequest: Annotation<string>(),
	ticket: Annotation<string>({
		reducer: (a: any, b: any) => b,
	}),
	sourceCode: Annotation<SourceCode>({
		reducer: (a: any, b: any) => b,
	}),
	projectId: Annotation<string>,
})

class Team {

	static async implement(changeRequest: ChangeRequestDto): Promise<ProjectDto> {

		const graph = new StateGraph({
			input: RootAnnotation,
			output: RootAnnotation,
		})
			.addNode("ProductOwner", productOwner)
			.addNode("ReactDeveloper", reactDeveloper)
			.addNode("UiUxDesigner", uiUxDesigner)
			.addNode("GraphicDesigner", graphicDesigner)
			.addEdge(START, "ProductOwner")
			.addEdge("ProductOwner", "UiUxDesigner")
			.addEdge("UiUxDesigner", "GraphicDesigner")
			.addEdge("GraphicDesigner", "ReactDeveloper")
			.addEdge("ReactDeveloper", END)
			.compile()

		const changes = await graph.invoke({
			userRequest: changeRequest.message,
			ticket: undefined,
			sourceCode: changeRequest.project.sourceCode,
			projectId: changeRequest.project.projectId
		})

		const newSourceCode: ProjectDto = {
			projectId: changeRequest.project.projectId,
			sourceCode: {
				...changes.sourceCode,
			}
			
		}

		return newSourceCode
	}
}

export default Team
