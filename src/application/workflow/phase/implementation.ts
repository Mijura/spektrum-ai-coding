import { AIDevelopmentWorkflow } from "@app/workflow/ai-development-workflow"
import { CodeGeneratorPort } from "@app/ports/services/code-generator"
import { TaskEmitter } from "@app/events/emitters/task-update"
import { Task } from "@jigjoy-ai/task-contracts"
import { FileArtifacts } from "@domain/file-artifacts"
import { Phase } from "@app/workflow/phase/phase"
import { ProjectPlanningService } from "@app/ports/services/project-planning-service"
import { Contribution, ContributionType } from "@app/types/contribution"

export class ImplementationPhase implements Phase {
	constructor(
		private readonly projectPlanningService: ProjectPlanningService,
		private readonly codeGenerator: CodeGeneratorPort,
	) {}

	async execute(context: AIDevelopmentWorkflow): Promise<void> {
		const sourceCode: FileArtifacts = context.getSourceCode()
		const task: Task = context.getTask()

		console.log("React Developer is developing task", task.id)

		let contribution: Contribution = {
			taskId: task.id,
			workerId: "React Developer",
			message: "React Developer is generating the code...",
			type: ContributionType.STARTED_WORK,
		}
		let updatedTask = await this.projectPlanningService.recordWork(contribution)
		TaskEmitter.taskUpdated(updatedTask)

		const response = await this.codeGenerator.generateCode(task, sourceCode)

		context.addCost(response.totalCostInUSD)
		context.updateSourceCode(response.sourceCode)

		let finishedContribution: Contribution = {
			taskId: task.id,
			workerId: "React Developer",
			message: "React Developer finished with coding",
			type: ContributionType.FINISHED_WORK,
		}
		updatedTask = await this.projectPlanningService.recordWork(finishedContribution)
		TaskEmitter.taskUpdated(updatedTask)

		updatedTask = await this.projectPlanningService.leaveComment(task.id, response.comment, "React Developer")
		TaskEmitter.taskUpdated(updatedTask)
		context.updateTask(updatedTask)
	}
}
