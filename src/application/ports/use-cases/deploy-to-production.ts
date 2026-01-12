import { EntryPoint } from "@jigjoy-io/project-deployment-client"

export interface DeployToProductionUseCase {
	execute(projectId: string): Promise<EntryPoint>
}
