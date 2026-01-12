import { InitializeReactModuleUseCase } from "@app/ports/use-cases/initialize-react-module"
import { CodebaseRepositoryPort } from "@app/ports/repositories/codebase-repository"
import { VersionControlServicePort } from "@app/ports/services/version-control-service"
import { Version } from "@domain/version"
import { Codebase } from "@domain/codebase"
import { Module, ModuleType } from "@domain/module"
import { TemplateRepositoryPort } from "@app/ports/repositories/template-repository"

export class InitializeReactModule implements InitializeReactModuleUseCase {
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
