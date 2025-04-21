import { Annotation } from "@langchain/langgraph"
import { SourceCode } from "@domain/entities/source-code"
import { Project } from "@domain/entities/project"
import { Ticket } from "@domain/entities/ticket"

export const RootAnnotation = Annotation.Root({
	project: Annotation<Project>({
		reducer: (a: any, b: any) => b,
	}),
	ticket: Annotation<Ticket>({
		reducer: (a: any, b: any) => b,
	}),
	sourceCode: Annotation<SourceCode>({
		reducer: (a: any, b: any) => b,
	})
})