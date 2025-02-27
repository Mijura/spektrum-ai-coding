import { Annotation, StateGraph, START, END, MessagesAnnotation } from "@langchain/langgraph"
import { productOwner } from "./agents/product-owner"
import { reactDeveloper, toolNodeForGraph } from "./agents/react-developer"
import { uiUxDesigner } from "./agents/uiux-designer"
import { graphicDesigner } from "./agents/graphic-designer"
import { ChangeRequestDto, ProjectDto, SourceCodeDto } from "../dto/project"
import { BaseMessage } from "@langchain/core/messages"

// Define Root Annotation with Reducer
export const RootAnnotation = Annotation.Root({
	messages: Annotation<BaseMessage[]>({
		reducer: (x, y) => x.concat(y),
		default: () => [],
	  }),
	userRequest: Annotation<string>(),
	ticket: Annotation<string>({
		reducer: (a: any, b: any) => b,
	}),
	sourceCode: Annotation<SourceCodeDto>({
		reducer: (a: any, b: any) => b,
	}),
	projectId: Annotation<string>,
})

const shouldContinue = (state: typeof RootAnnotation.State) => {
	const { messages } = state;
	const lastMessage = messages[messages.length - 1];
	if ("tool_calls" in lastMessage && Array.isArray(lastMessage.tool_calls) && lastMessage.tool_calls?.length) {
	  return "tools";
	}
	return "__end__";
  }

class Team {
	static async implement(changeRequest: ChangeRequestDto): Promise<SourceCodeDto> {
		const graph = new StateGraph({
			input: RootAnnotation,
			output: RootAnnotation,
		})
			.addNode("ProductOwner", productOwner)
			.addNode("ReactDeveloper", reactDeveloper)
			.addNode("UiUxDesigner", uiUxDesigner)
			//.addNode("GraphicDesigner", graphicDesigner)
			.addNode("tools", toolNodeForGraph)
			.addEdge(START, "ProductOwner")
			.addEdge("ProductOwner", "UiUxDesigner")
			//.addEdge("UiUxDesigner", "GraphicDesigner")
			.addEdge("UiUxDesigner", "ReactDeveloper")
			.addConditionalEdges("ReactDeveloper", shouldContinue)
			.addEdge("tools", "ReactDeveloper")
			.compile()

		const changes = await graph.invoke({
			userRequest: changeRequest.message,
			ticket: undefined,
			sourceCode: changeRequest.project.sourceCode,
			projectId: changeRequest.project.projectId,
		})

		return changes.sourceCode
	}
}

export default Team
