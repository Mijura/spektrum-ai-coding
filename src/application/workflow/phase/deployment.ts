import { DeployModuleCommand, EnvironmentType, ProjectDeploymentClient } from "@jigjoy-io/project-deployment-client"
import { ProjectPlanningClient } from "@jigjoy-io/project-planning-client"
import { AIDevelopmentWorkflow } from "../ai-development-workflow"
import { TaskEmitter } from "@app/events/emitters/task-update"
import { ActivityType } from "@jigjoy-io/task-contracts"
import { FileArtifacts } from "@domain/file-artifacts"
import { Phase } from "./phase"

export class DeploymentPhase implements Phase {
	constructor(
		private readonly projectDeploymentClient: ProjectDeploymentClient,
		private readonly projectPlanningClient: ProjectPlanningClient,
	) {}
	async execute(context: AIDevelopmentWorkflow): Promise<void> {
		const module = context.getModule()
		const task = context.getTask()
		const buildArtifacts: FileArtifacts = context.getBuildArtifacts()
		console.log("Deploying build artifacts", buildArtifacts)

		let updatedTask = await this.projectPlanningClient.recordWork(
			task.id,
			"React Developer",
			"Deploying the application...",
			ActivityType.STARTED_WORK,
		)
		TaskEmitter.taskUpdated(updatedTask)

		console.log("Deploying module...")
		const deploymentRequest: DeployModuleCommand = {
			projectId: task.projectId,
			moduleId: module.id,
			moduleType: module.type,
			versionControlId: module.repositoryId,
			environmentType: EnvironmentType.DEV,
			setAsEntryPoint: true,
		}

		await this.projectDeploymentClient.deployModule(deploymentRequest)

		console.log("Module deployed successfully")

		updatedTask = await this.projectPlanningClient.recordWork(
			task.id,
			"React Developer",
			"App deployed — check Output tab to test.",
			ActivityType.FINISHED_WORK,
		)
		TaskEmitter.taskUpdated(updatedTask)
	}
}
