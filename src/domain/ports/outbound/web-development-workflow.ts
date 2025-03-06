import { Project } from "@domain/entities/project"
import { UserRequestDto } from "src/application/dto/user-request"

export interface WebDevelopmentWorkflow {
	develop(userRequest: UserRequestDto): Promise<Project>
}
