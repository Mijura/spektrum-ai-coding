import { Project } from "@domain/entities/project"


export interface CodeGenerationWorkflow {
	on(event: "update", listener: (data: any) => void): unknown
	on(event: "done", listener: (data: any) => void): unknown
	execute(project: Project, message: string): Promise<Project>
}
