import { Annotation, StateGraph, START, END, MessagesAnnotation, MemorySaver } from "@langchain/langgraph"
import { productOwner } from "./agents/product-owner"
import { reactDeveloper } from "./agents/react-developer"
import { uiUxDesigner } from "./agents/uiux-designer"
import { graphicDesigner } from "./agents/graphic-designer"
import { ChangeRequestDto, ProjectDto, SourceCodeDto } from "../dto/project"
import { BaseMessage } from "@langchain/core/messages"
import { writeFilesTool } from "./tools/write-files-tool"

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
	const { messages } = state
	const lastMessage = messages[messages.length - 1]
	if ("tool_calls" in lastMessage && Array.isArray(lastMessage.tool_calls) && lastMessage.tool_calls?.length) {
		return "writeFiles"
	}
	return "__end__"
}

class Team {
	static async implement(changeRequest: ChangeRequestDto): Promise<SourceCodeDto> {
		const workflow = new StateGraph({
			input: RootAnnotation,
			output: RootAnnotation,
		})
			.addNode("ProductOwner", productOwner)
			.addNode("ReactDeveloper", reactDeveloper)
			//.addNode("UiUxDesigner", uiUxDesigner)
			//.addNode("GraphicDesigner", graphicDesigner)
			.addNode("writeFiles", writeFilesTool)
			.addEdge(START, "ProductOwner")
			//.addEdge("ProductOwner", "UiUxDesigner")
			//.addEdge("UiUxDesigner", "GraphicDesigner")
			.addEdge("ProductOwner", "ReactDeveloper")
			.addConditionalEdges("ReactDeveloper", shouldContinue, ["writeFiles", END])
			.addEdge("writeFiles", END)

		const checkpointer = new MemorySaver()

		const app = workflow.compile({ checkpointer });

		const finalState = await app.invoke({
			userRequest: changeRequest.message,
			ticket: undefined,
			sourceCode: changeRequest.project.sourceCode,
			projectId: changeRequest.project.projectId,
		},
		{ configurable: { thread_id: "42" } }
	)

		return finalState.sourceCode
	}
}

export default Team
