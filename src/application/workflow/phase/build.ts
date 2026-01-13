import { ProjectPlanningClient } from "@jigjoy-io/project-planning-client"
import { LocalDevEnvironment } from "@app/services/local-dev-environment"
import { AIDevelopmentWorkflow } from "../ai-development-workflow"
import { TaskEmitter } from "@app/events/emitters/task-update"
import { ActivityType } from "@jigjoy-io/task-contracts"
import { Phase } from "./phase"

export class BuildPhase implements Phase {
	constructor(
		private readonly projectPlanningClient: ProjectPlanningClient,
		private readonly devEnvironment: LocalDevEnvironment,
	) {}

	async execute(context: AIDevelopmentWorkflow): Promise<void> {
		const sourceCode = context.getSourceCode()
		const task = context.getTask()

		console.log("Building source code")

		let updatedTask = await this.projectPlanningClient.recordWork(
			task.id,
			"React Developer",
			"Building the application...",
			ActivityType.STARTED_WORK,
		)
		TaskEmitter.taskUpdated(updatedTask)

		const buildArtifacts = await this.devEnvironment.build(sourceCode)
		context.updateBuildArtifacts(buildArtifacts)

		updatedTask = await this.projectPlanningClient.recordWork(
			task.id,
			"React Developer",
			"Build finished successfully",
			ActivityType.FINISHED_WORK,
		)
		TaskEmitter.taskUpdated(updatedTask)

		context.setTask(updatedTask)
	}
}
