import { EntryPoint } from "@jigjoy-io/project-deployment-client"

export interface DeployToProduction {
    execute(projectId: string): Promise<EntryPoint>
}