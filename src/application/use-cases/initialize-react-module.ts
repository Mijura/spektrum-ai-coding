import { InitializeReactModule } from '@application/ports/inbound/initialize-react-module'
import { CodebaseRepositoryPort } from '@application/ports/outbound/codebase-repository'
import { Codebase } from '@domain/entities/codebase'
import { Template } from '@domain/ports/templates/template'
import { Module } from '@domain/value-objects/module'
import { ArtifactsDTO, ProjectArtifactsClient } from '@jigjoy-io/project-artifacts-client'

export class InitializeReactModuleUseCase implements InitializeReactModule {


    constructor(private projectArtifactsClient: ProjectArtifactsClient, private template: Template, private codebaseRepository: CodebaseRepositoryPort){}

    async execute(projectId: string): Promise<void> {

        // initialize project history
        const repositoryId = await this.projectArtifactsClient.initializeProjectHistory()

        // fetch template files and save it
        const buildArtifacts = await this.template.fetchPrebuiltFiles()
        const sourceCode = await this.template.fetchSourceCode()

        const artifacts: ArtifactsDTO = {
            repositoryId: repositoryId,
            buildArtifacts: buildArtifacts,
            sourceCodeArtifacts: sourceCode
        }
        this.projectArtifactsClient.saveArtifacts(artifacts)

        // create codebase and add module to it
        const codeabase = Codebase.create(projectId)
        const module: Module = {
            repositoryId: repositoryId,
            type: 'frontend',
            framework: 'react'
        }
        codeabase.addModule(module)
        // save codebase to repository
        await this.codebaseRepository.save(codeabase)

    }
    
}