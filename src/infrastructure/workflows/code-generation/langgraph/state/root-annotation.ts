import { ProjectDto, SourceCodeDto } from "@domain/types/project"
import { Annotation } from "@langchain/langgraph"
import { FrontendDevelopmentService } from "@application/services/fronted-development"
import { TicketDto } from "@application/dto/ticket"

export const RootAnnotation = Annotation.Root({
	message: Annotation<string>({
		reducer: (x, y) => y
	}),
	project: Annotation<ProjectDto>({
		reducer: (a: any, b: any) => b,
	}),
	ticket: Annotation<TicketDto>({
		reducer: (a: any, b: any) => b,
	}),
	sourceCode: Annotation<SourceCodeDto>({
		reducer: (a: any, b: any) => b,
	}),
	frontendDevelopmentService: Annotation<FrontendDevelopmentService>()
})