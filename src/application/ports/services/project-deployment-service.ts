import { DeploymentRequest } from "@app/types/deployment-request"
import { EntryPoint } from "@app/types/entry-point"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export interface ProjectDeploymentService {
	deployModule(projectId: string, deploymentRequest: DeploymentRequest, auth: Auth<UserData>): Promise<EntryPoint>
}
