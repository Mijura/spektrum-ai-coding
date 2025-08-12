import { TaskExecution } from "@domain/entities/task-execution"
import { TaskExecutionRepository } from "@domain/ports/repositories/task-execution-repository"
import { TaskRepository } from "@domain/ports/repositories/task-repository"
import { RunTaskExecution } from "@domain/use-cases/task-execution/run"
import { Team } from "@domain/ports/ai/team"
import { WebHostingService } from "@domain/ports/services/web-hosting-service"
import { VersionControlSystem } from "@domain/ports/version-control-system"
import { Commit } from "@domain/value-objects/commit"
import { ProjectRepository } from "@domain/ports/repositories/project-repository"
import { WorkUnit } from "@domain/value-objects/work-unit"
import { eventBus } from "@domain/events/event-bus"
import { Task } from "@domain/entities/task"
import { Deployment, Project } from "@domain/entities/project"

export class FrontendDevelopmentUseCase implements RunTaskExecution {

	constructor(
		private readonly taskRepository: TaskRepository,
		private readonly taskExecutionRepository: TaskExecutionRepository,
		private readonly frontendTeam: Team,
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
		const project: Project = await this.projectRepository.get(task.projectId)
		if (!project.latestDevDeployment) {
			throw new Error("Project has no dev deployment")
		}
		let sourceCode = await this.versionControlSystem.pullSourceCode(project.latestDevDeployment.version)

		eventBus.on("task:update", async (task: Task) => {
			await this.taskRepository.save(task)
		})

        try {
			const changeRequest: WorkUnit = { task, sourceCode, buildArtifact: null }
            const work: WorkUnit = await this.frontendTeam.implement(changeRequest)

			if (!work.buildArtifact) {
				throw new Error("Build artifact is not created")
			}

			const url = await this.webHostingService.deployPrebuiltCode(project.devEnvironmentId, work.buildArtifact)
	
			const commit: Commit = { buildArtifact: work.buildArtifact, sourceCode: work.sourceCode }
			const version = await this.versionControlSystem.commitVersion(project.id, commit)

			const deployment : Deployment = { url, version }
			project.setLatestDevDeployment(deployment)
			await this.projectRepository.save(project)

            taskExecution.finishSuccessfully()
			
			await this.taskRepository.save(work.task)

        } catch (error: any) {
            console.error(error)
            taskExecution.finishWithError(error as string)
            throw error
        } finally {
            await this.taskExecutionRepository.save(taskExecution)
        }
		
	}
}
