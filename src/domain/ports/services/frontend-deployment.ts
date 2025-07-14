import { Version } from "@domain/entities/version"

export interface FrontendDeploymentService {
    /**
     * Deploys the frontend project to the given environment
     * @param version - The version of the project to deploy
     * @returns The URL of the deployed project
     */
    deploy(projectPath: string, version: Version, shouldBuild?: boolean): Promise<string>
}