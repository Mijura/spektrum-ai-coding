import { CodebaseRepositoryPort } from "@application/ports/outbound/codebase-repository"
import { DeployToProduction } from "@application/ports/use-cases/deploy-to-production"
import { DeployModuleCommand, EntryPoint, EnvironmentType, ProjectDeploymentClient } from "@jigjoy-io/project-deployment-client"

export class DeployToProductionUseCase implements DeployToProduction {
    constructor(private readonly projectDeploymentClient: ProjectDeploymentClient, private readonly codebaseRepository: CodebaseRepositoryPort) {}

    async execute(projectId: string): Promise<EntryPoint> {
        const codebase = await this.codebaseRepository.get(projectId)
        const module = codebase.modules[0] // TODO: support multiple modules
        if (!module) {
            throw new Error("Module not found")
        }
        const deploymentRequest: DeployModuleCommand = {
            projectId: projectId,
            moduleId: module.id,
            moduleType: module.type,
            versionControlId: module.repositoryId,
            environmentType: EnvironmentType.PROD,
            setAsEntryPoint: true,
        }
        return await this.projectDeploymentClient.deployModule(deploymentRequest)
    }
}