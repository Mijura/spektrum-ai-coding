import { TaskExecution, TaskExecutionStatus } from "@app/types/task-execution"
import { VersionControlService } from "@app/ports/services/version-control-service"
import { CodebaseRepositoryPort } from "@app/ports/repositories/codebase-repository"
import { TaskExecutionEmitter } from "@app/events/emitters/task-execution"
import { LocalDevEnvironment } from "@app/services/local-dev-environment"
import { CodeGeneratorPort } from "@app/ports/services/code-generator"
import { Task } from "@jigjoy-io/task-contracts"
import { TaskEmitter } from "@app/events/emitters/task-update"
import { ImplementationPhase } from "@app/workflow/phase/implementation"
import { FileArtifacts } from "@domain/file-artifacts"
import { DeploymentPhase } from "./phase/deployment"
import { BuildPhase } from "./phase/build"
import { Version } from "@domain/version"
import { Module } from "@domain/module"
import { Phase } from "@app/workflow/phase/phase"
import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { ProjectPlanningService } from "@app/ports/services/project-planning-service"
import { Contribution, ContributionType } from "@app/types/contribution"
import { ObservabilityService } from "@app/ports/services/observability-service"

export class AIDevelopmentWorkflow {
	private phase!: Phase
	private numberOfTries: number = 3
	private task!: Task
	private sourceCode!: FileArtifacts
	private buildArtifacts!: FileArtifacts
	private module!: Module

	constructor(
		private readonly codebaseRepository: CodebaseRepositoryPort,
		private readonly projectPlanningService: ProjectPlanningService,
		private readonly devEnvironment: LocalDevEnvironment,
		private readonly versionControlService: VersionControlService,
		private readonly observabilityService: ObservabilityService,
		private readonly projectDeploymentService: ProjectDeploymentService,
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

	getTask(): Task {
		return this.task
	}

	getSourceCode(): FileArtifacts {
		return this.sourceCode
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
		let version: Version = await this.versionControlService.pull(module.repositoryId)
		this.sourceCode = version.sourceCodeArtifacts
		this.buildArtifacts = version.buildArtifacts
		this.module = module

		const taskExecution: TaskExecution = await this.observabilityService.taskExecutionStarted(
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
				this.setPhase(new ImplementationPhase(this.projectPlanningService, this.codeGenerator))
				await this.phase.execute(this)
				this.setPhase(new BuildPhase(this.projectPlanningService, this.devEnvironment))
				await this.phase.execute(this)
				break
			} catch (error: any) {
				console.error(error)
				currentTry++

				let contribution: Contribution = {
					taskId: this.task.id,
					workerId: "React Developer",
					message: "Finsihed with error. Please create a new task with the bug description.",
					type: ContributionType.FINISHED_WORK,
				}
				let updatedTask = await this.projectPlanningService.recordWork(contribution)

				updatedTask = await this.projectPlanningService.leaveComment(
					this.task.id,
					error.message,
					"React Developer",
				)

				this.updateTask(updatedTask)
				TaskEmitter.taskUpdated(updatedTask)
			}
		}

		if (currentTry > this.numberOfTries) {
			const errorMessage = "Failed to develop task after " + this.numberOfTries + " tries"
			await this.observabilityService.taskExecutionFailed(taskExecution.id, errorMessage)
			taskExecution.status = TaskExecutionStatus.FAILED
			taskExecution.error = errorMessage
			TaskExecutionEmitter.taskExecutionUpdated(taskExecution)

			throw new Error(errorMessage)
		}

		// save created artifacts
		await this.versionControlService.push({
			repositoryId: module.repositoryId,
			buildArtifacts: this.buildArtifacts,
			sourceCodeArtifacts: this.sourceCode,
		})

		this.setPhase(new DeploymentPhase(this.projectDeploymentService, this.projectPlanningService))
		await this.phase.execute(this)

		await this.observabilityService.taskExecutionSucceeded(taskExecution.id)
		taskExecution.status = TaskExecutionStatus.SUCCEEDED
		TaskExecutionEmitter.taskExecutionUpdated(taskExecution)
	}
}
