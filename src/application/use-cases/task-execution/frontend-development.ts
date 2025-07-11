import { TaskExecution } from "@domain/entities/task-execution"
import { TeamService } from "@domain/ports/team-service"
import { TaskExecutionRepository } from "@domain/repositories/task-execution-repository"
import { TaskRepository } from "@domain/repositories/task-repository"
import { RunTaskExecution } from "@domain/use-cases/task-execution/run"

export class FrontendDevelopmentUseCase implements RunTaskExecution {

	constructor(
		private readonly taskRepository: TaskRepository,
		private readonly taskExecutionRepository: TaskExecutionRepository,
		private readonly frontendTeam: TeamService
	) {}

	async execute(taskId: string, accountId: string): Promise<void> {
		console.log("Running frontend development workflow for task:", taskId, "and account:", accountId)
		const task = await this.taskRepository.get(taskId)
		if (!task) {
			throw new Error("Task not found")
		}

		const taskExecution = TaskExecution.create(task, "Frontend Development", accountId)

        try {
            const artifact = await this.frontendTeam.startWorking(task)
            taskExecution.finishSuccessfully(artifact)
        } catch (error: any) {
            console.error(error)
            taskExecution.finishWithError(error as string, null)
            throw error
        } finally {
            await this.taskExecutionRepository.save(taskExecution)
        }
		
	}
}
