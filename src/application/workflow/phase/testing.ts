import { ProjectPlanningClient } from "@jigjoy-io/project-planning-client"
import { AIDevelopmentWorkflow } from "../ai-development-workflow"
import { Phase } from "./phase"
import { ActivityType } from "@jigjoy-io/task-contracts"
import { TaskEmitter } from "@app/events/emitters/task-update"
import { LocalDevEnvironment } from "@app/services/local-dev-environment"

export class TestingPhase implements Phase {
	constructor(
		private readonly projectPlanningClient: ProjectPlanningClient,
		private readonly devEnvironment: LocalDevEnvironment,
	) {}

	async execute(context: AIDevelopmentWorkflow): Promise<void> {
		const sourceCode = context.getSourceCode()
		const task = context.getTask()

		console.log("Testing source code", sourceCode)

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
	}
}
