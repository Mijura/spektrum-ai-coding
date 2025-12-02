import { Develop } from "@application/ports/inbound/develop"
import { WorkUnit } from "@domain/value-objects/work-unit"
import { ArtifactsDTO, ProjectArtifactsClient } from "@jigjoy-io/project-artifacts-client"
import { DevEnvironment } from "@domain/ports/services/dev-environment"
import { Command, Agent, Message } from "@jigjoy-io/mosaic"
import z from "zod"

export class DevelopUseCase implements Develop {

	constructor(
		private readonly projectArtifactsClient: ProjectArtifactsClient,
		private readonly devEnvironment: DevEnvironment
	) {}

	async execute(task: string, chatHistory: Message[], repositoryId: string): Promise<void> {


        try {

			let artifactsDTO: ArtifactsDTO = await this.projectArtifactsClient.fetchArtifacts(repositoryId)

			const changeRequest: WorkUnit = { 
				task, 
				buildArtifacts: artifactsDTO.buildArtifacts,
				sourceCode: artifactsDTO.sourceCodeArtifacts
			}

			const outputSchema = z.object({
				sourceCode: z
					.object({})
					.catchall(z.string().describe("The source code (content) inside a file"))
					.describe("A map where each key is a file path and the value is the source code for that file"),
				comment: z.string().describe("The comment to be added to the task. It's a short summary of the changes you made from the user's perspective")
			})

			const command: Command = {
				model: 'gpt-5',
				messages: chatHistory,
				task: `### Role:
				You are an React Frontend Developer working on React project with Tailwind CSS and Framer Motion. 
		
				### **Your Tasks:**

					1. **Modify or create new files according the task description and activities**:
					- When create a new feature, you should create a reusable components in the separate files.
					- You should use the components in the src/components/ui folder to develop new features.
					- You should keep all previous features visible and working.
					- When new feature is requested, you should ensure that its visible to the user, along with all previous features.

					**Task with plan:**
					${JSON.stringify(changeRequest.task)}

					MOST IMPORTANT:
					- Update package.json if you plan to import new dependencies. (e.g. "chart.js" should be added to the dependencies)
					- Always use classes from the index.css and tailwind.config.js files.
					- Do not put technology names in the code. (e.g. "Application created using React, Tailwind CSS and Framer Motion...")
					- Do not use 'JigJoy' in the code. (e.g. "JigJoy Blog, Application created using JigJoy, etc..."), but keep the JigJoy meta tags in the index.html file, except user request change of meta tags.
		
					### **Details**
					- **Current Source Code:** ${JSON.stringify(changeRequest.sourceCode)}
        		`,
				structuredOutput: outputSchema
			}



			const developer = new Agent(command)
			const sourceCode = await developer.act()
			const buildArtifacts = await this.devEnvironment.build(sourceCode)


			// save created artifacts
			await this.projectArtifactsClient.saveArtifacts({
				repositoryId: repositoryId,
				buildArtifacts: buildArtifacts,
				sourceCodeArtifacts: sourceCode
			})


        } catch (error: any) {
            console.error(error)
        } 
		
	}
}
