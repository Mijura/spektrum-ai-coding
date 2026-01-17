import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { DeploymentRequest } from "@app/types/deployment-request"
import { DeployModuleCommand, ProjectDeploymentClient } from "@jigjoy-io/project-deployment-client"

export class JigJoyProjectDeploymentService implements ProjectDeploymentService {
	projectDeploymentClient: ProjectDeploymentClient
	constructor() {
		const endpoint = process.env.PROJECT_DEPLOYMENT_ENDPOINT as string
		this.projectDeploymentClient = new ProjectDeploymentClient(endpoint)
	}

	async deployModule(projectId: string, deploymentRequest: DeploymentRequest): Promise<EntryPoint> {
		const request: DeployModuleCommand = {
			projectId: projectId,
			moduleId: deploymentRequest.moduleId,
			moduleType: deploymentRequest.moduleType,
			versionControlId: deploymentRequest.repositoryId,
			environmentType: deploymentRequest.environmentType,
			setAsEntryPoint: true,
		}

		const entryPoint = await this.projectDeploymentClient.deployModule(request)
		return entryPoint
	}

	async createCloudProfile(projectId: string): Promise<void> {
		return await this.projectDeploymentClient.createCloudProfile(projectId)
	}
}
