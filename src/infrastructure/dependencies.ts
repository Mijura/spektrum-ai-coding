import { BundlerServicePort } from "@app/ports/services/bundler-service"
import { RspackBundlerService } from "@infra/services/bundler/rspack-bundler"
import { FileSelectionFilter } from "@infra/services/filesystem/file-selection-filter"
import { SourceCodeFilter } from "@infra/shared/filters/source-code-filter"
import { DistFolderFilter } from "@infra/shared/filters/dist-folder-filter"
import { TemplateRepositoryPort } from "@app/ports/repositories/template-repository"
import { RspackTemplateRepository } from "@infra/repositories/template/rspack-template-repository"
import { YarnPackageManager } from "@infra/services/bundler/yarn-package-manager"
import { LocalDevEnvironment } from "@app/services/local-dev-environment"
import { AICodingController } from "./http/controllers/ai-coding-controller"
import { InitializeReactModule } from "@app/use-cases/initialize-react-module"
import { ModuleController } from "./http/controllers/module-controller"
import { FileSystemServicePort } from "@app/ports/services/file-system-service"
import { LocalFileSystem } from "@infra/services/filesystem/local-file-system"
import { CodebaseRepositoryPort } from "@app/ports/repositories/codebase-repository"
import { DynamoDBCodebaseRepository } from "@infra/repositories/codebase/codebase-repository"
import { InitializeReactModuleUseCase } from "@app/ports/use-cases/initialize-react-module"
import { JigJoyVCS } from "./services/version-control/jigjoy-vcs"
import { VersionControlServicePort } from "@app/ports/services/version-control-service"
import { ProjectDeploymentClient } from "@jigjoy-io/project-deployment-client"
import { DeployToProduction } from "@app/use-cases/deploy-to-production"
import { DeployToProductionUseCase } from "@app/ports/use-cases/deploy-to-production"
import { ObservabilityClient } from "@jigjoy-io/observability-client"
import { ProjectPlanningClient } from "@jigjoy-io/project-planning-client"
import { Develop } from "@app/use-cases/develop"
import { DevelopUseCase } from "@app/ports/use-cases/develop"

// Controllers
export const aiCodingController = new AICodingController()
export const moduleController = new ModuleController()

// Services
export const fileSystemService: FileSystemServicePort = new LocalFileSystem()
export const sourceCodeFilter: FileSelectionFilter = new SourceCodeFilter(fileSystemService)
export const distFolderFilter: FileSelectionFilter = new DistFolderFilter(fileSystemService)

export const yarnPackageManager: YarnPackageManager = new YarnPackageManager()
export const rspackBundler: BundlerServicePort = new RspackBundlerService(yarnPackageManager, distFolderFilter)

// Templates
export const rspackTemplateRepository: TemplateRepositoryPort = new RspackTemplateRepository(
	sourceCodeFilter,
	distFolderFilter,
)

export const localDevEnvironment: LocalDevEnvironment = new LocalDevEnvironment(rspackBundler, fileSystemService)

export const codebaseRepository: CodebaseRepositoryPort = new DynamoDBCodebaseRepository()

const versionControl: VersionControlServicePort = new JigJoyVCS()

const projectDeploymentEndpoint = process.env.PROJECT_DEPLOYMENT_ENDPOINT
if (!projectDeploymentEndpoint) {
	throw new Error("PROJECT_DEPLOYMENT_ENDPOINT is not set")
}

const projectDeploymentClient = new ProjectDeploymentClient(projectDeploymentEndpoint)

const observabilityEndpoint = process.env.OBSERVABILITY_ENDPOINT
if (!observabilityEndpoint) {
	throw new Error("OBSERVABILITY_ENDPOINT is not set")
}
const observabilityClient = new ObservabilityClient(observabilityEndpoint)

const projectPlanningEndpoint = process.env.PROJECT_PLANNING_ENDPOINT
if (!projectPlanningEndpoint) {
	throw new Error("PROJECT_PLANNING_ENDPOINT is not set")
}
const projectPlanningClient = new ProjectPlanningClient(projectPlanningEndpoint)

// Use Cases
export const develop: DevelopUseCase = new Develop(
	versionControl,
	localDevEnvironment,
	codebaseRepository,
	projectDeploymentClient,
	observabilityClient,
	projectPlanningClient,
)

export const initializeReactModule: InitializeReactModuleUseCase = new InitializeReactModule(
	versionControl,
	rspackTemplateRepository,
	codebaseRepository,
)

export const deployToProduction: DeployToProductionUseCase = new DeployToProduction(
	projectDeploymentClient,
	codebaseRepository,
)
