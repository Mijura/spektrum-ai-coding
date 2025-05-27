import { TaskRepository } from "@domain/repositories/task-repository"
import { WorkflowRegistry } from "@domain/repositories/workflow-registry"
import { RunWorkflow } from "@domain/use-cases/workflow/run-workflow"
import { Workflow } from "@domain/workflow/workflow"

export class RunWorkflowUseCase implements RunWorkflow {

	constructor(
		private readonly taskRepository: TaskRepository,
		private readonly workflowRegistry: WorkflowRegistry
	) {}

	async execute(taskId: string, workflowId: string, accountId: string): Promise<void> {
		console.log("Running frontend development workflow for task:", taskId, "and account:", accountId)
		const task = await this.taskRepository.findById(taskId)
		if (!task) {
			throw new Error("Task not found")
		}

		const workflow: Workflow = await this.workflowRegistry.get(workflowId)

		await workflow.run(task, accountId)
		
	}
}
