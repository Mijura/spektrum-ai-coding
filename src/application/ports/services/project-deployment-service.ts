import { DeploymentRequest } from "@app/types/deployment-request"
import { EntryPoint } from "@jigjoy-io/project-deployment-client"

export interface ProjectDeploymentService {
	deployModule(projectId: string, deploymentRequest: DeploymentRequest): Promise<EntryPoint>
}
