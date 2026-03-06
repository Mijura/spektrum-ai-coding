import { CodebaseRepositoryPort } from "@app/ports/repositories/codebase-repository"
import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { DeployToProductionRequest, DeployToProductionUseCase } from "@app/ports/use-cases/deploy-to-production"
import { DeploymentRequest, EnvironmentType } from "@app/types/deployment-request"
import { EntryPoint } from "@app/types/entry-point"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"


export class DeployToProduction implements DeployToProductionUseCase {
	constructor(
		private readonly projectDeploymentService: ProjectDeploymentService,
		private readonly codebaseRepository: CodebaseRepositoryPort,
	) {}

	async execute(auth: Auth<UserData>, params: DeployToProductionRequest): Promise<EntryPoint> {

		console.log(`Auth data: ${JSON.stringify(auth)}`)

		const { projectId } = params
		const codebase = await this.codebaseRepository.get(projectId)
		const module = codebase.modules[0] // TODO: support multiple modules
		if (!module) {
			throw new Error("Module not found")
		}
		const deploymentRequest: DeploymentRequest = {
			moduleId: module.id,
			repositoryId: module.repositoryId,
			moduleType: module.type,
			environmentType: EnvironmentType.PROD,
			setAsEntryPoint: true,
		}
		return await this.projectDeploymentService.deployModule(projectId, deploymentRequest, auth)
	}
}
