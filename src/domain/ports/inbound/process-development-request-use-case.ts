import { UserRequestDto } from "@application/dto/user-request"
import { Project } from "@domain/entities/project"

export interface DevelopmentRequest {
	process(request: UserRequestDto): Promise<Project>
}
