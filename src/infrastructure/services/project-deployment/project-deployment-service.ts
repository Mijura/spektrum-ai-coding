import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { DeploymentRequest } from "@app/types/deployment-request"
import { EntryPoint } from "@app/types/entry-point"
import { DeployModuleCommand, SpektrumClient } from "@jigjoy-ai/spektrum-client"

export class JigJoyProjectDeploymentService implements ProjectDeploymentService {
    private readonly spektrumClient: SpektrumClient
	constructor() {
		const JIGJOY_API_ENDPOINT = process.env.JIGJOY_API_ENDPOINT || ""
		this.spektrumClient = new SpektrumClient(`${JIGJOY_API_ENDPOINT}`, { kind: "internal" , token: process.env.INTERNAL_SERVICE_TOKEN || "" })
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

		const entryPoint = await this.spektrumClient.deployment.deployModule(request)
		return entryPoint
	}

	async createCloudProfile(projectId: string): Promise<void> {
		return await this.spektrumClient.deployment.createCloudProfile(projectId)
	}
}
