import { ProjectDetails } from "@domain/model/project-details"


export interface CodeGenerationWorkflow {
	on(event: "update", listener: (data: any) => void): unknown
	on(event: "done", listener: (data: any) => void): unknown
	execute(projectDetails: ProjectDetails, message: string): Promise<ProjectDetails>
}
