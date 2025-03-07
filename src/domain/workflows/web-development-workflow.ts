import { ProjectDetails } from "@domain/entities/project-details"
import { UserRequestDto } from "src/application/dto/user-request"

/**
 * Web Development Workflow
 * 
 * This workflow is responsible for the development of a web application.
 */
export interface WebDevelopmentWorkflow {
	process(userRequest: UserRequestDto): Promise<ProjectDetails>
}
