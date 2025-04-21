import { Annotation } from "@langchain/langgraph"
import { FrontendDevelopmentService } from "@domain/services/frontend-development"
import { ProjectRecord } from "@infrastructure/records/project"
import { TicketRecord } from "@infrastructure/records/ticket"
import { SourceCode } from "@domain/entities/source-code"

export const RootAnnotation = Annotation.Root({
	message: Annotation<string>({
		reducer: (x, y) => y
	}),
	project: Annotation<ProjectRecord>({
		reducer: (a: any, b: any) => b,
	}),
	ticket: Annotation<TicketRecord>({
		reducer: (a: any, b: any) => b,
	}),
	sourceCode: Annotation<SourceCode>({
		reducer: (a: any, b: any) => b,
	})
})