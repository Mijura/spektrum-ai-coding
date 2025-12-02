import { InitializeReactProject } from '@application/ports/inbound/initialize-react-project'
import { Codebase } from '@domain/entities/codebase'
import { Template } from '@domain/ports/templates/template'
import { Module } from '@domain/value-objects/module'
import { ArtifactsDTO, ProjectArtifactsClient } from '@jigjoy-io/project-artifacts-client'

export class InitializeReactProjectUseCase implements InitializeReactProject{


    constructor(private projectArtifactsClient: ProjectArtifactsClient, private template: Template){}

    async execute(projectId: string): Promise<void> {

        const repositoryId = await this.projectArtifactsClient.initializeProjectHistory()

        const buildArtifacts = await this.template.fetchPrebuiltFiles()
        const sourceCode = await this.template.fetchSourceCode()

        const artifacts: ArtifactsDTO = {
            repositoryId: repositoryId,
            buildArtifacts: buildArtifacts,
            sourceCodeArtifacts: sourceCode
        }
        this.projectArtifactsClient.saveArtifacts(artifacts)


        const codeabase = Codebase.create(projectId)
        const module: Module = {
            repositoryId: repositoryId,
            type: 'frontend',
            framework: 'react'
        }
        codeabase.addModule(module)


    }
    
}