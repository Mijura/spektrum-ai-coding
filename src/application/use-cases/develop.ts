import { Develop } from "@domain/use-cases/develop"
import { WorkUnit } from "@domain/value-objects/work-unit"
import { Agent } from "@domain/agent"
import { ArtifactsDTO, ProjectArtifactsClient } from "@jigjoy-io/project-artifacts-client"
import { Task } from "@domain/entities/task"

export class DevelopUseCase implements Develop {

	constructor(
		private readonly projectArtifactsClient: ProjectArtifactsClient,
		private readonly reactDeveloper: Agent
	) {}

	async execute(task: Task, projectHistoryId: string): Promise<void> {


        try {

			let artifactsDTO: ArtifactsDTO = await this.projectArtifactsClient.fetchArtifacts(projectHistoryId)

			const changeRequest: WorkUnit = { 
				task, 
				buildArtifacts: artifactsDTO.buildArtifacts,
				sourceCode: artifactsDTO.sourceCodeArtifacts
			}

            const work: WorkUnit = await this.reactDeveloper.execute(changeRequest)


			// save created artifacts
			await this.projectArtifactsClient.saveArtifacts({
				repositoryId: projectHistoryId,
				buildArtifacts: work.buildArtifacts,
				sourceCodeArtifacts: work.sourceCode
			})


        } catch (error: any) {
            console.error(error)
        } 
		
	}
}
