import { Annotation, StateGraph, START, END, MemorySaver } from "@langchain/langgraph"
import { productOwner } from "./agents/product-owner"
import { reactDeveloper } from "./agents/react-developer"
import { uiUxDesigner } from "./agents/uiux-designer"
import { BaseMessage } from "@langchain/core/messages"
import { rebuildProject } from "./tools/rebuild-project"
import { fetchProject } from "./tools/fetch-project"
import { ChangeRequestDto } from "@dto/change-request"
import { SourceCodeDto } from "@dto/source-code"
import { ProjectDto } from "@dto/project"
import { updateProjectDetails } from "./tools/update-project-details"

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
	projectDetails: Annotation<ProjectDto>({
		reducer: (a: any, b: any) => b,
	}),
	sourceCode: Annotation<SourceCodeDto>({
		reducer: (a: any, b: any) => b,
	}),
	projectId: Annotation<string>,
})

class Team {
	static async implement(changeRequest: ChangeRequestDto): Promise<SourceCodeDto> {
		const workflow = new StateGraph({
			input: RootAnnotation,
			output: RootAnnotation,
		})
			.addNode("fetchProject", fetchProject)
			.addNode("ProductOwner", productOwner)
			.addNode("ReactDeveloper", reactDeveloper)
			.addNode("UiUxDesigner", uiUxDesigner)
			.addNode("rebuild", rebuildProject)
			.addNode("updateProjectDetails", updateProjectDetails)
			.addEdge(START, "fetchProject")
			.addEdge("fetchProject", "ProductOwner")
			.addEdge("ProductOwner", "UiUxDesigner")
			.addEdge("UiUxDesigner", "ReactDeveloper")
			.addEdge("ReactDeveloper", "rebuild")
			.addEdge("rebuild", "updateProjectDetails")			
			.addEdge("updateProjectDetails", END)

		const checkpointer = new MemorySaver()

		const app = workflow.compile({ checkpointer });

		const finalState = await app.invoke({
			userRequest: changeRequest.message,
			projectId: changeRequest.project.id,
		},
		{ configurable: { thread_id: "42" } }
	)

		return finalState.sourceCode
	}
}

export default Team
