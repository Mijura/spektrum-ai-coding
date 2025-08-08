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
import { ChangeRequest } from "@domain/value-objects/change-request"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"

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
		const project = await this.projectRepository.get(task.projectId)
		if (!project.latestDevDeployment) {
			throw new Error("Project has no dev deployment")
		}
		let sourceCode = await this.versionControlSystem.pullSourceCode(project.latestDevDeployment.version)

        try {
			const changeRequest: ChangeRequest = {task, sourceCode}
            const updatedSourceCode: FileArtifacts = await this.frontendTeam.startWorking(changeRequest)

			const buildArtifact = await this.devEnvironment.build(updatedSourceCode)
			const url = await this.webHostingService.deployPrebuiltCode(task.projectId, buildArtifact)
	
			const commit: Commit = { buildArtifact, sourceCode: updatedSourceCode }
			const project = await this.projectRepository.get(task.projectId)
			const version = await this.versionControlSystem.commitVersion(project.id, commit)
			project.setLatestDevDeployment({url , version})

            taskExecution.finishSuccessfully(updatedSourceCode)
        } catch (error: any) {
            console.error(error)
            taskExecution.finishWithError(error as string, null)
            throw error
        } finally {
            await this.taskExecutionRepository.save(taskExecution)
        }
		
	}
}
