import { Project } from "@domain/entities/project"
import { ProjectUseCase } from "@domain/ports/inbound/project-use-case"
import { ProjectRepository } from "@domain/ports/outbound/project-repository"
import { ChangeRequestDto } from "../dto/change-request"

export class ImplementChangeRequest implements ProjectUseCase<ChangeRequestDto, Project | null> {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(changeRequest: ChangeRequestDto): Promise<Project | null> {
		return null
	}
}
