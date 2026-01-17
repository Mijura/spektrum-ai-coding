import { DeployModuleCommand, EnvironmentType } from "@jigjoy-io/project-deployment-client"
import { ProjectPlanningClient } from "@jigjoy-io/project-planning-client"
import { AIDevelopmentWorkflow } from "../ai-development-workflow"
import { TaskEmitter } from "@app/events/emitters/task-update"
import { ActivityType } from "@jigjoy-io/task-contracts"
import { Phase } from "./phase"
import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { DeploymentRequest } from "@app/types/deployment-request"

export class DeploymentPhase implements Phase {
	constructor(
		private readonly projectDeploymentService: ProjectDeploymentService,
		private readonly projectPlanningClient: ProjectPlanningClient,
	) {}
	async execute(context: AIDevelopmentWorkflow): Promise<void> {
		const module = context.getModule()
		const task = context.getTask()
		console.log("Deploying the application...")

		let updatedTask = await this.projectPlanningClient.recordWork(
			task.id,
			"React Developer",
			"Deploying the application...",
			ActivityType.STARTED_WORK,
		)
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

		updatedTask = await this.projectPlanningClient.recordWork(
			task.id,
			"React Developer",
			"App deployed — check Output tab to test.",
			ActivityType.FINISHED_WORK,
		)
		TaskEmitter.taskUpdated(updatedTask)
		context.setTask(updatedTask)
	}
}
