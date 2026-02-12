import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { DeploymentRequest } from "@app/types/deployment-request"
import { EntryPoint } from "@app/types/entry-point"
import { DeployModuleCommand, PlatformSDK } from "@jigjoy-ai/platform-sdk"

export class JigJoyProjectDeploymentService implements ProjectDeploymentService {
    private readonly jigjoyClient: PlatformSDK
	constructor() {
		const JIGJOY_API_ENDPOINT = process.env.JIGJOY_API_ENDPOINT || ""
		this.jigjoyClient = new PlatformSDK(`${JIGJOY_API_ENDPOINT}`)
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

		const entryPoint = await this.jigjoyClient.deployment.deployModule(request)
		return entryPoint
	}

	async createCloudProfile(projectId: string): Promise<void> {
		return await this.jigjoyClient.deployment.createCloudProfile(projectId)
	}
}
