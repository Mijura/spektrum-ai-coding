import { ObservabilityClient, TaskExecution, TaskExecutionStatus } from "@jigjoy-io/observability-client"
import { VersionControlServicePort } from "@app/ports/services/version-control-service"
import { CodebaseRepositoryPort } from "@app/ports/repositories/codebase-repository"
import { ProjectDeploymentClient } from "@jigjoy-io/project-deployment-client"
import { ProjectPlanningClient } from "@jigjoy-io/project-planning-client"
import { TaskExecutionEmitter } from "@app/events/emitters/task-execution"
import { LocalDevEnvironment } from "@app/services/local-dev-environment"
import { CodeGeneratorPort } from "@app/ports/services/code-generator"
import { ActivityType, Task } from "@jigjoy-io/task-contracts"
import { TaskEmitter } from "@app/events/emitters/task-update"
import { ImplementationPhase } from "./phase/implementation"
import { FileArtifacts } from "@domain/file-artifacts"
import { DeploymentPhase } from "./phase/deployment"
import { BuildPhase } from "./phase/build"
import { Version } from "@domain/version"
import { Module } from "@domain/module"
import { Phase } from "./phase/phase"

export class AIDevelopmentWorkflow {
	private phase!: Phase
	private numberOfTries: number = 3
	private task!: Task
	private sourceCode!: FileArtifacts
	private buildArtifacts!: FileArtifacts
	private module!: Module

	constructor(
		private readonly codebaseRepository: CodebaseRepositoryPort,
		private readonly projectPlanningClient: ProjectPlanningClient,
		private readonly devEnvironment: LocalDevEnvironment,
		private readonly vcs: VersionControlServicePort,
		private readonly observabilityClient: ObservabilityClient,
		private readonly projectDeploymentClient: ProjectDeploymentClient,
		private readonly codeGenerator: CodeGeneratorPort,
	) {}

	setPhase(phase: Phase): void {
		this.phase = phase
	}

	updateTask(task: Task): void {
		this.task = task
	}

	updateSourceCode(sourceCode: FileArtifacts): void {
		this.sourceCode = sourceCode
	}

	updateBuildArtifacts(buildArtifacts: FileArtifacts): void {
		this.buildArtifacts = buildArtifacts
	}

	setTask(task: Task): void {
		this.task = task
	}

	getTask(): Task {
		return this.task
	}

	getSourceCode(): FileArtifacts {
		return this.sourceCode
	}

	getBuildArtifacts(): FileArtifacts {
		return this.buildArtifacts
	}

	getModule(): Module {
		return this.module
	}

	async handleTask(task: Task, accountId: string): Promise<void> {
		this.task = task
		const codebase = await this.codebaseRepository.get(this.task.projectId)
		const module = codebase.modules[0] // TODO: support multiple modules
		if (!module) {
			throw new Error("Module not found")
		}
		let version: Version = await this.vcs.pull(module.repositoryId)
		this.sourceCode = version.sourceCodeArtifacts
		this.buildArtifacts = version.buildArtifacts
		this.module = module

		const taskExecution: TaskExecution = await this.observabilityClient.taskExecutionStarted(
			this.task.title,
			this.task.projectId,
			this.task.id,
			accountId,
		)
		TaskExecutionEmitter.newTaskExecution(taskExecution)
		console.log("Task execution started", taskExecution)

		let currentTry = 1
		while (currentTry <= this.numberOfTries) {
			try {
				this.setPhase(new ImplementationPhase(this.projectPlanningClient, this.codeGenerator))
				await this.phase.execute(this)
				this.setPhase(new BuildPhase(this.projectPlanningClient, this.devEnvironment))
				await this.phase.execute(this)
				break
			} catch (error: any) {
				console.error(error)
				this.numberOfTries--

				let updatedTask = await this.projectPlanningClient.recordWork(
					this.task.id,
					"React Developer",
					"Finsihed with error. Please create a new task with the bug description.",
					ActivityType.FINISHED_WORK,
				)
				TaskEmitter.taskUpdated(updatedTask)

				updatedTask = await this.projectPlanningClient.leaveComment(
					this.task.id,
					error.message,
					"React Developer",
				)

				this.setTask(updatedTask)
				TaskEmitter.taskUpdated(updatedTask)
			}
		}

		if (currentTry > this.numberOfTries) {
			const errorMessage = "Failed to develop task after " + this.numberOfTries + " tries"
			await this.observabilityClient.taskExecutionFailed(taskExecution.id, errorMessage)
			taskExecution.status = TaskExecutionStatus.FAILED
			taskExecution.error = errorMessage
			TaskExecutionEmitter.taskExecutionUpdated(taskExecution)

			throw new Error(errorMessage)
		}

		// save created artifacts
		await this.vcs.push({
			repositoryId: module.repositoryId,
			buildArtifacts: this.buildArtifacts,
			sourceCodeArtifacts: this.sourceCode,
		})

		this.setPhase(new DeploymentPhase(this.projectDeploymentClient, this.projectPlanningClient))
		await this.phase.execute(this)

		await this.observabilityClient.taskExecutionSucceeded(taskExecution.id)
		taskExecution.status = TaskExecutionStatus.SUCCEEDED
		TaskExecutionEmitter.taskExecutionUpdated(taskExecution)
	}
}
