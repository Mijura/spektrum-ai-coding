import { TaskExecution } from "@domain/entities/task-execution"
import { TaskExecutionRepository } from "@domain/ports/repositories/task-execution-repository"
import { TaskRepository } from "@domain/ports/repositories/task-repository"
import { RunTaskExecution } from "@domain/use-cases/task-execution/run"
import { Team } from "@domain/ports/ai/team"
import { DevEnvironment } from "@domain/ports/services/dev-environment"
import { WebHostingService } from "@domain/ports/services/web-hosting-service"
import { VersionControlSystem } from "@domain/ports/version-control-system"
import { Commit } from "@domain/value-objects/commit"
import { ProjectRepository } from "@domain/ports/repositories/project-repository"

export class FrontendDevelopmentUseCase implements RunTaskExecution {

	constructor(
		private readonly taskRepository: TaskRepository,
		private readonly taskExecutionRepository: TaskExecutionRepository,
		private readonly frontendTeam: Team,
		private readonly devEnvironment: DevEnvironment,
		private readonly webHostingService: WebHostingService,
		private readonly versionControlSystem: VersionControlSystem,
		private readonly projectRepository: ProjectRepository
	) {}

	async execute(taskId: string, accountId: string): Promise<void> {
		console.log("Running frontend development workflow for task:", taskId, "and account:", accountId)
		const task = await this.taskRepository.get(taskId)
		if (!task) {
			throw new Error("Task not found")
		}

		const taskExecution = TaskExecution.create(task, accountId)

        try {
            const sourceCode = await this.frontendTeam.startWorking(task)
			const buildArtifact = await this.devEnvironment.build(sourceCode)

			const url = await this.webHostingService.deployPrebuiltCode(buildArtifact)
	
			const commit: Commit = { buildArtifact, sourceCode }
			const project = await this.projectRepository.get(task.projectId)
			const version = await this.versionControlSystem.commitVersion(project.id, commit)
			project.setLatestDevDeployment({url , version})

            taskExecution.finishSuccessfully(sourceCode)
        } catch (error: any) {
            console.error(error)
            taskExecution.finishWithError(error as string, null)
            throw error
        } finally {
            await this.taskExecutionRepository.save(taskExecution)
        }
		
	}
}
