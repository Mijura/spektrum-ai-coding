
import { PrototypingWorkflow } from "@infrastructure/workflows/prototyping/main"
import { TaskRepository } from "@domain/repositories/task-repository"
import { RunPrototypingWorkflow } from "@domain/use-cases/workflow-run/run-prototyping-workflow"

export class RunPrototypingWorkflowUseCase implements RunPrototypingWorkflow {

	constructor(
		private readonly taskRepository: TaskRepository,
		private readonly prototypingWorkflow: PrototypingWorkflow
	) {}

	async run(taskId: string, accountId: string): Promise<void> {
		console.log("Running prototyping workflow for task:", taskId, "and account:", accountId)
		const task = await this.taskRepository.findById(taskId)
		if (!task) {
			throw new Error("Task not found")
		}

		await this.prototypingWorkflow.run(task, accountId)
		
	}
}
