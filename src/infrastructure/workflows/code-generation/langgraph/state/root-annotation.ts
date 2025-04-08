import { ProjectDto, SourceCodeDto } from "@domain/types/project"
import { Annotation } from "@langchain/langgraph"
import { FrontendDevelopmentService } from "@application/services/fronted-development"

export const RootAnnotation = Annotation.Root({
	message: Annotation<string>({
		reducer: (x, y) => y
	}),
	tickets: Annotation<string[]>({
		reducer: (a: any, b: any) => b,
	}),
	project: Annotation<ProjectDto>({
		reducer: (a: any, b: any) => b,
	}),
	sourceCode: Annotation<SourceCodeDto>({
		reducer: (a: any, b: any) => b,
	}),
	userRequest: Annotation<string>(),
	frontendDevelopmentService: Annotation<FrontendDevelopmentService>()
})