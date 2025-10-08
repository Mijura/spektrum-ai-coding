import { TaskExecution } from "@domain/entities/task-execution"
import { TaskExecutionRepository } from "@domain/ports/repositories/task-execution-repository"
import { TaskRepository } from "@domain/ports/repositories/task-repository"
import { Develop } from "@domain/use-cases/task-execution/develop"
import { WebHostingService } from "@domain/ports/services/web-hosting-service"
import { VersionControlSystem } from "@domain/ports/version-control-system"
import { ProjectRepository } from "@domain/ports/repositories/project-repository"
import { WorkUnit } from "@domain/value-objects/work-unit"
import { Project } from "@domain/entities/project"
import { Agent } from "@domain/value-objects/agent"

export class DevelopUseCase implements Develop {

	constructor(
		private readonly taskRepository: TaskRepository,
		private readonly taskExecutionRepository: TaskExecutionRepository,
		private readonly webHostingService: WebHostingService,
		private readonly versionControlSystem: VersionControlSystem,
		private readonly projectRepository: ProjectRepository,
		private readonly reactDeveloper: Agent

	) {}

	async execute(taskId: string, accountId: string): Promise<void> {
		console.log("Running frontend development workflow for task:", taskId, "and account:", accountId)
		const task = await this.taskRepository.get(taskId)
		if (!task) {
			throw new Error("Task not found")
		}

		const taskExecution = TaskExecution.create(task, accountId)
		await this.taskExecutionRepository.save(taskExecution)

        try {

			const project: Project = await this.projectRepository.get(task.projectId)

			let sourceCode = await this.versionControlSystem.pull(project.id)

			const changeRequest: WorkUnit = { task, sourceCode, buildArtifact: null }

            const work: WorkUnit = await this.reactDeveloper.execute(changeRequest)


			if (!work.buildArtifact) {
				throw new Error("Build artifact is not created")
			}

			const url = await this.webHostingService.deployPrebuiltCode(project.id, work.buildArtifact)
	
			const version = await this.versionControlSystem.commit(project.id, work.sourceCode)

			const deployment = { url, version }
			await this.projectRepository.save(project)

            taskExecution.finishSuccessfully()

        } catch (error: any) {
            console.error(error)
            taskExecution.finishWithError(error as string)
        } finally {
            await this.taskExecutionRepository.save(taskExecution)
        }
		
	}
}
