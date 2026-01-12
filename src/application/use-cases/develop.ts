import { DeployModuleCommand, EnvironmentType, ProjectDeploymentClient } from "@jigjoy-io/project-deployment-client"
import { ObservabilityClient, TaskExecution, TaskExecutionStatus } from "@jigjoy-io/observability-client"
import { CodebaseRepositoryPort } from "@application/ports/repositories/codebase-repository"
import { TaskExecutionEmitter } from "@application/events/emitters/task-execution"
import { LocalDevEnvironment } from "@application/services/local-dev-environment"
import { VersionControlServicePort } from "@application/ports/services/version-control-service"
import { ProjectPlanningClient } from "@jigjoy-io/project-planning-client"
import { TaskEmitter } from "@application/events/emitters/task-update"
import { Develop } from "@application/ports/use-cases/develop"
import { ActivityType, Task } from "@jigjoy-io/task-contracts"
import { Version } from "@domain/version"
import { Command, Agent } from "@jigjoy-io/mosaic"
import { z } from "zod"

export class DevelopUseCase implements Develop {
	constructor(
		private readonly vcs: VersionControlServicePort,
		private readonly devEnvironment: LocalDevEnvironment,
		private readonly codebaseRepository: CodebaseRepositoryPort,
		private readonly projectDeploymentClient: ProjectDeploymentClient,
		private readonly observabilityClient: ObservabilityClient,
		private readonly projectPlanningClient: ProjectPlanningClient,
	) {}

	async execute(task: Task, accountId: string): Promise<void> {
		const taskExecution: TaskExecution = await this.observabilityClient.taskExecutionStarted(
			task.title,
			task.projectId,
			task.id,
			accountId,
		)
		TaskExecutionEmitter.newTaskExecution(taskExecution)
		console.log("Task execution started", taskExecution)
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

			let updatedTask = await this.projectPlanningClient.recordWork(
				task.id,
				"React Developer",
				"React Developer is generating the code...",
				ActivityType.STARTED_WORK,
			)
			TaskEmitter.taskUpdated(updatedTask)
			const response = await developer.act()

			updatedTask = await this.projectPlanningClient.recordWork(
				task.id,
				"React Developer",
				"React Developer finished with coding",
				ActivityType.FINISHED_WORK,
			)
			TaskEmitter.taskUpdated(updatedTask)

			updatedTask = await this.projectPlanningClient.leaveComment(task.id, response.comment, "React Developer")
			TaskEmitter.taskUpdated(updatedTask)

			updatedTask = await this.projectPlanningClient.recordWork(
				task.id,
				"React Developer",
				"React Developer started app deployment",
				ActivityType.STARTED_WORK,
			)
			TaskEmitter.taskUpdated(updatedTask)

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

			console.log("Module deployed successfully")
			await this.observabilityClient.taskExecutionSucceeded(taskExecution.id)
			taskExecution.status = TaskExecutionStatus.SUCCEEDED
			TaskExecutionEmitter.taskExecutionUpdated(taskExecution)

			updatedTask = await this.projectPlanningClient.recordWork(
				task.id,
				"React Developer",
				"App deployed — check Output tab to test.",
				ActivityType.FINISHED_WORK,
			)
			TaskEmitter.taskUpdated(updatedTask)
		} catch (error: any) {
			console.error(error)

			await this.observabilityClient.taskExecutionFailed(taskExecution.id, error.message)
			taskExecution.status = TaskExecutionStatus.FAILED
			taskExecution.error = error.message
			TaskExecutionEmitter.taskExecutionUpdated(taskExecution)

			let updatedTask = await this.projectPlanningClient.recordWork(
				task.id,
				"React Developer",
				"Finsihed with error. Please create a new task with the bug description.",
				ActivityType.FINISHED_WORK,
			)
			TaskEmitter.taskUpdated(updatedTask)

			updatedTask = await this.projectPlanningClient.leaveComment(task.id, error.message, "React Developer")
			TaskEmitter.taskUpdated(updatedTask)
		}
	}
}
