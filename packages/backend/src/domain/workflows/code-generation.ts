import { ProjectDetails } from "@domain/model/project-details"


export interface CodeGenerationWorkflow {
	execute(projectDetails: ProjectDetails, message: string): Promise<ProjectDetails>
}
