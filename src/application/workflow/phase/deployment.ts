import { EnvironmentType } from "@jigjoy-io/project-deployment-client"
import { AIDevelopmentWorkflow } from "../ai-development-workflow"
import { TaskEmitter } from "@app/events/emitters/task-update"
import { Phase } from "./phase"
import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { DeploymentRequest } from "@app/types/deployment-request"
import { ProjectPlanningService } from "@app/ports/services/project-planning-service"
import { Contribution, ContributionType } from "@app/types/contribution"

export class DeploymentPhase implements Phase {
	constructor(
		private readonly projectDeploymentService: ProjectDeploymentService,
		private readonly projectPlanningService: ProjectPlanningService,
	) {}
	async execute(context: AIDevelopmentWorkflow): Promise<void> {
		const module = context.getModule()
		const task = context.getTask()
		console.log("Deploying the application...")

		let contribution: Contribution = {
			taskId: task.id,
			workerId: "React Developer",
			message: "Deploying the application...",
			type: ContributionType.STARTED_WORK,
		}
		let updatedTask = await this.projectPlanningService.recordWork(contribution)
		TaskEmitter.taskUpdated(updatedTask)

		console.log("Deploying module...")
		const deploymentRequest: DeploymentRequest = {
			moduleId: module.id,
			moduleType: module.type,
			repositoryId: module.repositoryId,
			environmentType: EnvironmentType.DEV,
			setAsEntryPoint: true,
		}

		await this.projectDeploymentService.deployModule(task.projectId, deploymentRequest)

		console.log("Module deployed successfully")

		let finishedContribution: Contribution = {
			taskId: task.id,
			workerId: "React Developer",
			message: "App deployed — check Output tab to test.",
			type: ContributionType.FINISHED_WORK,
		}
		updatedTask = await this.projectPlanningService.recordWork(finishedContribution)
		TaskEmitter.taskUpdated(updatedTask)
		context.setTask(updatedTask)
	}
}
