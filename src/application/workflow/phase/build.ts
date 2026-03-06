import { LocalDevEnvironment } from "@app/services/local-dev-environment"
import { AIDevelopmentWorkflow } from "@app/workflow/ai-development-workflow"
import { TaskEmitter } from "@app/events/emitters/task-update"
import { Phase } from "@app/workflow/phase/phase"
import { ProjectPlanningService } from "@app/ports/services/project-planning-service"
import { Contribution, ContributionType } from "@app/types/contribution"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class BuildPhase implements Phase {
	constructor(
		private readonly projectPlanningService: ProjectPlanningService,
		private readonly devEnvironment: LocalDevEnvironment,
	) {}

	async execute(context: AIDevelopmentWorkflow, auth: Auth<UserData>): Promise<void> {
		const sourceCode = context.getSourceCode()
		const task = context.getTask()

		console.log("Building source code")

		let contribution: Contribution = {
			taskId: task.id,
			workerId: "React Developer",
			message: "Building the application...",
			type: ContributionType.STARTED_WORK,
		}
		let updatedTask = await this.projectPlanningService.recordWork(contribution, auth)
		TaskEmitter.taskUpdated(updatedTask)

		const buildArtifacts = await this.devEnvironment.build(sourceCode)
		context.updateBuildArtifacts(buildArtifacts)

		let finishedContribution: Contribution = {
			taskId: task.id,
			workerId: "React Developer",
			message: "Build finished successfully",
			type: ContributionType.FINISHED_WORK,
		}
		updatedTask = await this.projectPlanningService.recordWork(finishedContribution, auth)
		TaskEmitter.taskUpdated(updatedTask)

		context.updateTask(updatedTask)
	}
}
