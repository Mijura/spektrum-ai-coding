import { InitializeReactModule } from "@application/ports/use-cases/initialize-react-module"
import { CodebaseRepositoryPort } from "@application/ports/repositories/codebase-repository"
import { VersionControlServicePort } from "@application/ports/services/version-control-service"
import { Version } from "@application/value-objects/version"
import { Codebase } from "@domain/codebase"
import { Module, ModuleType } from "@domain/module"
import { TemplateRepositoryPort } from "@application/ports/repositories/template-repository"

export class InitializeReactModuleUseCase implements InitializeReactModule {
	constructor(
		private vcs: VersionControlServicePort,
		private templateRepository: TemplateRepositoryPort,
		private codebaseRepository: CodebaseRepositoryPort,
	) {}

	async execute(projectId: string): Promise<Module> {
		// initialize project history
		const repositoryId = await this.vcs.init()

		// fetch template files and save it
		const buildArtifacts = await this.templateRepository.fetchPrebuiltFiles()
		const sourceCode = await this.templateRepository.fetchSourceCode()

		const version: Version = {
			repositoryId: repositoryId,
			buildArtifacts: buildArtifacts,
			sourceCodeArtifacts: sourceCode,
		}

		await this.vcs.push(version)

		// create codebase and add module to it
		const codeabase = Codebase.create(projectId)

		const module = Module.create(repositoryId, ModuleType.FRONTEND)

		codeabase.addModule(module)

		// save codebase to repository
		await this.codebaseRepository.save(codeabase)

		return module
	}
}
