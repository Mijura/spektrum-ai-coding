import { SourceCodeDto } from "@domain/types/project"
import { Annotation } from "@langchain/langgraph"
import { Project } from "@domain/entities/project"
import { Ticket } from "@domain/entities/ticket"
import { FrontendDevelopment } from "@domain/services/frontend-development"

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
	frontendDevelopmentService: Annotation<FrontendDevelopment>()
})