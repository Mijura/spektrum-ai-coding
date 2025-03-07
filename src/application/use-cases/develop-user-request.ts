import { ProjectDetails } from "@domain/entities/project-details"
import { UserRequestDto } from "../dto/user-request"
import { WebDevelopmentWorkflow } from "@domain/ports/outbound/web-development-workflow"
import { DevelopUserRequestUseCase } from "@domain/ports/inbound/develop-user-request-use-case"

export class DevelopUserRequest implements DevelopUserRequestUseCase {
	constructor(private readonly webDevelopmentWorkflow: WebDevelopmentWorkflow) {}

	async execute(userRequest: UserRequestDto): Promise<ProjectDetails> {
		return this.webDevelopmentWorkflow.develop(userRequest)
	}
}
