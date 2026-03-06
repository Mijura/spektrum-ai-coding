import { InitializeReactModuleRequest, InitializeReactModuleUseCase } from "@app/ports/use-cases/initialize-react-module"
import { CodebaseRepositoryPort } from "@app/ports/repositories/codebase-repository"
import { VersionControlService } from "@app/ports/services/version-control-service"
import { Version } from "@domain/version"
import { Codebase } from "@domain/codebase"
import { Module, ModuleType } from "@domain/module"
import { TemplateRepositoryPort } from "@app/ports/repositories/template-repository"
import { UserData } from "@jigjoy-ai/auth"
import { Auth } from "@heksagon/app"

export class InitializeReactModule implements InitializeReactModuleUseCase {
	constructor(
		private vcs: VersionControlService,
		private templateRepository: TemplateRepositoryPort,
		private codebaseRepository: CodebaseRepositoryPort,
	) {}

	async execute(auth: Auth<UserData>, params: InitializeReactModuleRequest): Promise<Module> {
		const { projectId } = params
		// initialize project history
		const repositoryId = await this.vcs.init(auth)

		// fetch template files and save it
		const buildArtifacts = await this.templateRepository.fetchPrebuiltFiles()
		const sourceCode = await this.templateRepository.fetchSourceCode()

		const version: Version = {
			repositoryId: repositoryId,
			buildArtifacts: buildArtifacts,
			sourceCodeArtifacts: sourceCode,
		}

		await this.vcs.push(version, auth)

		// create codebase and add module to it
		const codeabase = Codebase.create(projectId)

		const module = Module.create(repositoryId, ModuleType.FRONTEND)

		codeabase.addModule(module)

		// save codebase to repository
		await this.codebaseRepository.save(codeabase)

		return module
	}
}
