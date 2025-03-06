import { WebDevelopmentWorkflow } from "@domain/ports/outbound/web-development-workflow"
import { UserRequestDto } from "src/application/dto/user-request"
import { PackageManagerPort } from "@domain/ports/outbound/package-manager-port"
import { FileSystemPort } from "@domain/ports/outbound/file-system-port"
import { ProjectRepository } from "@domain/ports/outbound/project-repository"
import { Project } from "@domain/entities/project"

export class LangGraphWebDevelopment implements WebDevelopmentWorkflow {
	constructor(
		private readonly packageManager: PackageManagerPort,
		private readonly fileSystem: FileSystemPort,
		private readonly projectRepository: ProjectRepository
	) {}

	async run(userRequest: UserRequestDto): Promise<Project> {
		return new Project('123')
		
	}
}
