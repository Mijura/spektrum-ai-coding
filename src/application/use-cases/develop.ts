import { ProjectDeploymentClient } from "@jigjoy-io/project-deployment-client"
import { ObservabilityClient } from "@jigjoy-io/observability-client"
import { CodebaseRepositoryPort } from "@app/ports/repositories/codebase-repository"
import { LocalDevEnvironment } from "@app/services/local-dev-environment"
import { VersionControlServicePort } from "@app/ports/services/version-control-service"
import { ProjectPlanningClient } from "@jigjoy-io/project-planning-client"
import { AIDevelopmentWorkflow } from "@app/workflow/ai-development-workflow"
import { CodeAssistServicePort } from "@app/services/code-assist"
import { DevelopUseCase } from "@app/ports/use-cases/develop"
import { Task } from "@jigjoy-io/task-contracts"

export class Develop implements DevelopUseCase {
	constructor(
		private readonly codebaseRepository: CodebaseRepositoryPort,
		private readonly projectPlanningClient: ProjectPlanningClient,
		private readonly devEnvironment: LocalDevEnvironment,
		private readonly vcs: VersionControlServicePort,
		private readonly observabilityClient: ObservabilityClient,
		private readonly projectDeploymentClient: ProjectDeploymentClient,
		private readonly codeAssistService: CodeAssistServicePort,
	) {}

	async execute(task: Task, accountId: string): Promise<void> {
		try {
			const workflow = new AIDevelopmentWorkflow(
				this.codebaseRepository,
				this.projectPlanningClient,
				this.devEnvironment,
				this.vcs,
				this.observabilityClient,
				this.projectDeploymentClient,
				this.codeAssistService,
			)

			await workflow.handleTask(task, accountId)
		} catch (error: any) {
			console.error(error)
			throw error
		}
	}
}
