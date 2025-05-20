import { TaskRepository } from "@domain/repositories/task-repository"
import { RunWorkflow } from "@domain/use-cases/workflow/run-workflow"
import { Workflow } from "@domain/entities/workflow/workflow"
import { WorkflowRegistry } from "@domain/entities/workflow/workflow-registry"

export class RunWorkflowUseCase implements RunWorkflow {

	constructor(
		private readonly taskRepository: TaskRepository
	) {}

	async execute(taskId: string, workflowId: string, accountId: string): Promise<void> {
		console.log("Running prototyping workflow for task:", taskId, "and account:", accountId)
		const task = await this.taskRepository.findById(taskId)
		if (!task) {
			throw new Error("Task not found")
		}

		const workflow: Workflow = WorkflowRegistry.create(workflowId)

		await workflow.run(task, accountId)
		
	}
}
