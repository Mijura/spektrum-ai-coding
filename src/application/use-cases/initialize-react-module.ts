import { InitializeReactModule } from '@application/ports/use-cases/initialize-react-module'
import { CodebaseRepositoryPort } from '@application/ports/outbound/codebase-repository'
import { VersionControlPort } from '@application/ports/outbound/version-control'
import { Version } from '@application/value-objects/version'
import { Codebase } from '@domain/entities/codebase'
import { Module, ModuleType } from '@domain/entities/module'
import { Template } from '@domain/ports/templates/template'

export class InitializeReactModuleUseCase implements InitializeReactModule {


    constructor(private vcs: VersionControlPort, private template: Template, private codebaseRepository: CodebaseRepositoryPort){}

    async execute(projectId: string): Promise<Module> {

        // initialize project history
        const repositoryId = await this.vcs.init()

        // fetch template files and save it
        const buildArtifacts = await this.template.fetchPrebuiltFiles()
        const sourceCode = await this.template.fetchSourceCode()
        
        const version: Version = {
            repositoryId: repositoryId,
            buildArtifacts: buildArtifacts,
            sourceCodeArtifacts: sourceCode
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