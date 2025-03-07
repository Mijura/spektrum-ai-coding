import { ProjectDetails } from "@domain/entities/project-details"


export interface CodeGenerationWorkflow {
	execute(projectDetails: ProjectDetails, message: string): Promise<ProjectDetails>
}
