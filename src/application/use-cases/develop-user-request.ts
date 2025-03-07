import { ProjectDetails } from "@domain/entities/project-details"
import { UserRequestDto } from "../dto/user-request"
import { DevelopUserRequestUseCase } from "@domain/use-cases/develop-user-request-use-case"
import { FrontendDevelopmentService } from "@application/services/fronted-development-service"

export class DevelopUserRequest implements DevelopUserRequestUseCase {
	constructor(private readonly frontendDevelopmentService: FrontendDevelopmentService) {}

	async execute(userRequest: UserRequestDto): Promise<ProjectDetails> {
		return this.frontendDevelopmentService.develop(userRequest)
	}
}
