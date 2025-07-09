import { TaskRepository } from "@domain/repositories/task-repository"
import { WorkflowRegistry } from "@domain/repositories/workflow-registry"
import { RunTaskExecution } from "@domain/use-cases/task-execution/run"
import { WorkflowRunner } from "@domain/ports/workflow-runner"

export class RunTaskExecutionUseCase implements RunTaskExecution {

	constructor(
		private readonly taskRepository: TaskRepository,
		private readonly workflowRegistry: WorkflowRegistry
	) {}

	async execute(taskId: string, workflowId: string, accountId: string): Promise<void> {
		console.log("Running frontend development workflow for task:", taskId, "and account:", accountId)
		const task = await this.taskRepository.get(taskId)
		if (!task) {
			throw new Error("Task not found")
		}

		const workflow: WorkflowRunner = await this.workflowRegistry.get(workflowId)

		await workflow.run(task, accountId)
		
	}
}
