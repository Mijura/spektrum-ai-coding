import { WebDevelopmentWorkflow } from "@domain/workflows/web-development-workflow"
import { UserRequestDto } from "src/application/dto/user-request"
import { PackageManager } from "@domain/utils/package-manager"
import { FileSystemPort } from "@domain/utils/file-system"
import { ProjectStorage } from "@domain/persistence/project-storage"
import { ProjectDetails } from "@domain/entities/project-details"
import { Annotation, END, START, StateGraph } from "@langchain/langgraph"
import { BaseMessage } from "@langchain/core/messages"
import { ProjectDto } from "@application/dto/project"
import { SourceCodeDto } from "@application/dto/source-code"
import { fetchProject } from "./nodes/fetch-project"
import { productOwner } from "./nodes/product-owner"
import { reactDeveloper } from "./nodes/react-developer"
import { uiUxDesigner } from "./nodes/uiux-designer"
import { rebuildProject } from "./nodes/rebuild-project"
import { updateProjectDetails } from "./nodes/update-project-details"

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

export class LangGraphWebDevelopment implements WebDevelopmentWorkflow {
	constructor(
		private readonly packageManager: PackageManager,
		private readonly fileSystem: FileSystemPort,
		private readonly projectStorage: ProjectStorage
	) {}

	async process(userRequest: UserRequestDto): Promise<ProjectDetails> {
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
			.compile()

		const finalState = await workflow.invoke({
			userRequest: userRequest.message,
			projectId: userRequest.project.id,
		})

		return finalState.projectDetails
	}
}
