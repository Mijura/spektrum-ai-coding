import { CodebaseRepositoryPort } from "@app/ports/repositories/codebase-repository"
import { LocalDevEnvironment } from "@app/services/local-dev-environment"
import { VersionControlService } from "@app/ports/services/version-control-service"
import { AIDevelopmentWorkflow } from "@app/workflow/ai-development-workflow"
import { CodeGeneratorPort } from "@app/ports/services/code-generator"
import { DevelopUseCase } from "@app/ports/use-cases/develop"
import { Task } from "@jigjoy-ai/task-contracts"
import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { ProjectPlanningService } from "@app/ports/services/project-planning-service"
import { ObservabilityService } from "@app/ports/services/observability-service"
import { AccountAndBillingService } from "@app/ports/services/account-and-biling-service"

export class Develop implements DevelopUseCase {
	constructor(
		private readonly codebaseRepository: CodebaseRepositoryPort,
		private readonly projectPlanningService: ProjectPlanningService,
		private readonly devEnvironment: LocalDevEnvironment,
		private readonly versionControlService: VersionControlService,
		private readonly observabilityService: ObservabilityService,
		private readonly projectDeploymentService: ProjectDeploymentService,
		private readonly accountBillingService: AccountAndBillingService,
		private readonly codeGenerator: CodeGeneratorPort,
	) {}

	async execute(task: Task, accountId: string): Promise<number> {
		try {
			const workflow = new AIDevelopmentWorkflow(
				this.codebaseRepository,
				this.projectPlanningService,
				this.devEnvironment,
				this.versionControlService,
				this.observabilityService,
				this.projectDeploymentService,
				this.accountBillingService,
				this.codeGenerator,
			)

			const totalCostInUSD = await workflow.handleTask(task, accountId)
			return totalCostInUSD
		} catch (error: any) {
			console.error(error)
			throw error
		}
	}
}
