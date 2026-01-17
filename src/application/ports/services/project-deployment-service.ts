import { DeploymentRequest } from "@app/types/deployment-request"
import { EntryPoint } from "@app/types/entry-point"

export interface ProjectDeploymentService {
	deployModule(projectId: string, deploymentRequest: DeploymentRequest): Promise<EntryPoint>
}
