import { SourceCodeDto } from "@domain/types/project"
import { Annotation } from "@langchain/langgraph"
import { FrontendDevelopmentService } from "@application/services/fronted-development"
import { Project } from "@domain/entities/project"
import { Ticket } from "@domain/entities/ticket"

export const RootAnnotation = Annotation.Root({
	message: Annotation<string>({
		reducer: (x, y) => y
	}),
	project: Annotation<Project>({
		reducer: (a: any, b: any) => b,
	}),
	ticket: Annotation<Ticket>({
		reducer: (a: any, b: any) => b,
	}),
	sourceCode: Annotation<SourceCodeDto>({
		reducer: (a: any, b: any) => b,
	}),
	frontendDevelopmentService: Annotation<FrontendDevelopmentService>()
})