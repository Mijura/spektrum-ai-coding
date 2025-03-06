import { Project } from "@domain/entities/project"
import { ProjectUseCase } from "@domain/ports/inbound/project-use-case"
import { UserRequestDto } from "../dto/user-request"
import { WebDevelopmentWorkflow } from "@domain/ports/outbound/web-development-workflow"

export class RunWorkflow implements ProjectUseCase<UserRequestDto, Project | null> {
	constructor(private readonly webDevelopmentWorkflow: WebDevelopmentWorkflow) {}

	async execute(userRequest: UserRequestDto): Promise<Project | null> {
		return this.webDevelopmentWorkflow.develop(userRequest)
	}
}
