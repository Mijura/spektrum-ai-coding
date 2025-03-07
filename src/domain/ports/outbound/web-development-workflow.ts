import { Project } from "@domain/entities/project-details"
import { UserRequestDto } from "src/application/dto/user-request"

export interface WebDevelopmentWorkflow {
	develop(userRequest: UserRequestDto): Promise<Project>
}
