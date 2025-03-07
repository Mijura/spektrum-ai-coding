import { UserRequestDto } from "@application/dto/user-request"
import { ProjectDetails } from "@domain/entities/project-details"

export interface DevelopUserRequestUseCase {
	execute(request: UserRequestDto): Promise<ProjectDetails>
}
