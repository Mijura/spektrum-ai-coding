import { ProjectPlanningClient } from "@jigjoy-io/project-planning-client"
import { AIDevelopmentWorkflow } from "../ai-development-workflow"
import { CodeGeneratorPort } from "@app/ports/services/code-generator"
import { TaskEmitter } from "@app/events/emitters/task-update"
import { ActivityType, Task } from "@jigjoy-io/task-contracts"
import { FileArtifacts } from "@domain/file-artifacts"
import { Phase } from "./phase"

export class ImplementationPhase implements Phase {
	constructor(
		private readonly projectPlanningClient: ProjectPlanningClient,
		private readonly codeGenerator: CodeGeneratorPort,
	) {}

	async execute(context: AIDevelopmentWorkflow): Promise<void> {
		const sourceCode: FileArtifacts = context.getSourceCode()
		const task: Task = context.getTask()

		console.log("React Developer is developing task", task)

		let updatedTask = await this.projectPlanningClient.recordWork(
			task.id,
			"React Developer",
			"React Developer is generating the code...",
			ActivityType.STARTED_WORK,
		)
		TaskEmitter.taskUpdated(updatedTask)

		const response = await this.codeGenerator.generateCode(task, sourceCode)

		context.updateSourceCode(response.sourceCode)

		updatedTask = await this.projectPlanningClient.recordWork(
			task.id,
			"React Developer",
			"React Developer finished with coding",
			ActivityType.FINISHED_WORK,
		)
		TaskEmitter.taskUpdated(updatedTask)

		updatedTask = await this.projectPlanningClient.leaveComment(task.id, response.comment, "React Developer")
		TaskEmitter.taskUpdated(updatedTask)
		context.setTask(updatedTask)
	}
}
