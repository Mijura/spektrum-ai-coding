import { Develop } from "@application/ports/use-cases/develop"
import { DevEnvironment } from "@application/ports/outbound/dev-environment"
import { Command, Agent } from "@jigjoy-io/mosaic"
import { VersionControlPort } from "@application/ports/outbound/version-control"
import { Version } from "@application/value-objects/version"
import z from "zod"
import { CodebaseRepositoryPort } from "@application/ports/outbound/codebase-repository"
import { Task } from "@jigjoy-io/task-contracts"
import { DeployModuleCommand, EnvironmentType, ProjectDeploymentClient } from "@jigjoy-io/project-deployment-client"
import { ObservabilityClient, TaskExecution } from "@jigjoy-io/observability-client"

export class DevelopUseCase implements Develop {
	constructor(
		private readonly vcs: VersionControlPort,
		private readonly devEnvironment: DevEnvironment,
		private readonly codebaseRepository: CodebaseRepositoryPort,
		private readonly projectDeploymentClient: ProjectDeploymentClient,
		private readonly observabilityClient: ObservabilityClient,
	) {}

	async execute(task: Task, accountId: string): Promise<void> {


		const taskExecution: TaskExecution = await this.observabilityClient.taskExecutionStarted(task.title, task.projectId, task.id, accountId)
		console.log('Task execution started', taskExecution)
		try {

			const codebase = await this.codebaseRepository.get(task.projectId)
			const module = codebase.modules[0] // TODO: support multiple modules
			if (!module) {
				throw new Error("Module not found")
			}
			let version: Version = await this.vcs.pull(module.repositoryId)

			const outputSchema = z.object({
				sourceCode: z
					.object({})
					.catchall(z.string().describe("The source code (content) inside a file"))
					.describe("A map where each key is a file path and the value is the source code for that file"),
				comment: z
					.string()
					.describe(
						"The comment to be added to the task. It's a short summary of the changes you made from the user's perspective",
					),
			})

			const command: Command = {
				model: "gpt-5",
				task: `### Role:
				You are an React Frontend Developer working on React project with Tailwind CSS and Framer Motion. 
		
				### **Your Tasks:**

					1. **Modify or create new files according the task description and activities**:
					- When create a new feature, you should create a reusable components in the separate files.
					- You should use the components in the src/components/ui folder to develop new features.
					- You should keep all previous features visible and working.
					- When new feature is requested, you should ensure that its visible to the user, along with all previous features.
					- You should always update the package.json file to add new dependencies.
					- Figure out from the task history what should you do.

					**Here is the whole task history:**
					${JSON.stringify(task)}

					MOST IMPORTANT:
					- Update package.json if you plan to import new dependencies. (e.g. "chart.js" should be added to the dependencies)
					- Always use classes from the index.css and tailwind.config.js files.
					- Do not put technology names in the code. (e.g. "Application created using React, Tailwind CSS and Framer Motion...")
					- Do not use 'JigJoy' in the code. (e.g. "JigJoy Blog, Application created using JigJoy, etc..."), but keep the JigJoy meta tags in the index.html file, except user request change of meta tags.
		
					### **Details**
					- **Current Source Code:** ${JSON.stringify(version.sourceCodeArtifacts)}
        		`,
				structuredOutput: outputSchema,
			}

			const developer = new Agent(command)

			console.log("React Developer developing task...")
			const response = await developer.act()

			const sourceCode = {
				...version.sourceCodeArtifacts,
				...response.sourceCode,
			}
			const buildArtifacts = await this.devEnvironment.build(sourceCode)

			// save created artifacts
			await this.vcs.push({
				repositoryId: module.repositoryId,
				buildArtifacts: buildArtifacts,
				sourceCodeArtifacts: sourceCode,
			})

			console.log("Deploying module...")
			const deploymentRequest: DeployModuleCommand = {
				projectId: task.projectId,
				moduleId: module.id,
				moduleType: module.type,
				versionControlId: module.repositoryId,
				environmentType: EnvironmentType.DEV,
				setAsEntryPoint: true,
			}

			await this.projectDeploymentClient.deployModule(deploymentRequest)
			console.log('Module deployed successfully')
			await this.observabilityClient.taskExecutionSucceeded(taskExecution.id)
		} catch (error: any) {
			console.error(error)
			await this.observabilityClient.taskExecutionFailed(taskExecution.id, error.message)
		}
	}
}
