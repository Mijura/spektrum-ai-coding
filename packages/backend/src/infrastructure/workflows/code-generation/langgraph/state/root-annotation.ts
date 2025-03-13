import { BaseMessage } from "@langchain/core/messages"
import { SourceCode } from "@domain/model/source-code"
import { Annotation } from "@langchain/langgraph"
import { FrontendDevelopmentService } from "@application/services/fronted-development"
import { Project } from "@domain/model/project"

export const RootAnnotation = Annotation.Root({
	messages: Annotation<BaseMessage[]>({
		reducer: (x, y) => x.concat(y),
		default: () => [],
	}),
	ticket: Annotation<string>({
		reducer: (a: any, b: any) => b,
	}),
	project: Annotation<Project>({
		reducer: (a: any, b: any) => b,
	}),
	sourceCode: Annotation<SourceCode>({
		reducer: (a: any, b: any) => b,
	}),
	userRequest: Annotation<string>(),
	frontendDevelopmentService: Annotation<FrontendDevelopmentService>()
})