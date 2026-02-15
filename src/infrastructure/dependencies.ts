import { BundlerPort } from "@app/ports/services/bundler"
import { RspackBundlerService } from "@infra/services/bundler/rspack-bundler"
import { FileSelectionFilter } from "@infra/services/filesystem/file-selection-filter"
import { SourceCodeFilter } from "@infra/shared/filters/source-code-filter"
import { DistFolderFilter } from "@infra/shared/filters/dist-folder-filter"
import { TemplateRepositoryPort } from "@app/ports/repositories/template-repository"
import { RspackTemplateRepository } from "@infra/repositories/template/rspack-template-repository"
import { YarnPackageManager } from "@infra/services/bundler/yarn-package-manager"
import { LocalDevEnvironment } from "@app/services/local-dev-environment"
import { AICodingController } from "@infra/http/controllers/ai-coding-controller"
import { InitializeReactModule } from "@app/use-cases/initialize-react-module"
import { FileSystemPort } from "@app/ports/services/file-system"
import { LocalFileSystem } from "@infra/services/filesystem/local-file-system"
import { CodebaseRepositoryPort } from "@app/ports/repositories/codebase-repository"
import { DynamoDBCodebaseRepository } from "@infra/repositories/codebase/codebase-repository"
import { InitializeReactModuleUseCase } from "@app/ports/use-cases/initialize-react-module"
import { JigJoyVersionControl } from "@infra/services/version-control/jigjoy-vcs"
import { VersionControlService } from "@app/ports/services/version-control-service"
import { DeployToProduction } from "@app/use-cases/deploy-to-production"
import { DeployToProductionUseCase } from "@app/ports/use-cases/deploy-to-production"
import { Develop } from "@app/use-cases/develop"
import { DevelopUseCase } from "@app/ports/use-cases/develop"
import { JigJoyCodeGenerator } from "@infra/services/code-generator/jigjoy-code-generator"
import { CodeGeneratorPort } from "@app/ports/services/code-generator"
import { JigJoyProjectDeploymentService } from "@infra/services/project-deployment/project-deployment-service"
import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { ProjectPlanningService } from "@app/ports/services/project-planning-service"
import { JigJoyProjectPlanningService } from "@infra/services/project-planning/project-planning-service"
import { ObservabilityService } from "@app/ports/services/observability-service"
import { JigJoyObservabilityService } from "@infra/services/observability/observability-service"
import { AccountAndBillingService } from "@app/ports/services/account-and-biling-service"
import { JigJoyAccountAndBillingService } from "./services/account-and-billing/account-and-billing-service"

// Controllers
export const aiCodingController = new AICodingController()

// Services
export const fileSystemService: FileSystemPort = new LocalFileSystem()
export const sourceCodeFilter: FileSelectionFilter = new SourceCodeFilter(fileSystemService)
export const distFolderFilter: FileSelectionFilter = new DistFolderFilter(fileSystemService)

export const yarnPackageManager: YarnPackageManager = new YarnPackageManager()
export const rspackBundler: BundlerPort = new RspackBundlerService(yarnPackageManager, distFolderFilter)

// Templates
export const rspackTemplateRepository: TemplateRepositoryPort = new RspackTemplateRepository(
	sourceCodeFilter,
	distFolderFilter,
)

export const localDevEnvironment: LocalDevEnvironment = new LocalDevEnvironment(rspackBundler, fileSystemService)

export const codebaseRepository: CodebaseRepositoryPort = new DynamoDBCodebaseRepository()

const codeGenerator: CodeGeneratorPort = new JigJoyCodeGenerator()

const projectPlanningService: ProjectPlanningService = new JigJoyProjectPlanningService()
const projectDeploymentService: ProjectDeploymentService = new JigJoyProjectDeploymentService()
const versionControl: VersionControlService = new JigJoyVersionControl()
const observabilityService: ObservabilityService = new JigJoyObservabilityService()
const accountBillingService: AccountAndBillingService = new JigJoyAccountAndBillingService()
// Use Cases
export const developModuleUseCase: DevelopUseCase = new Develop(
	codebaseRepository,
	projectPlanningService,
	localDevEnvironment,
	versionControl,
	observabilityService,
	projectDeploymentService,
	accountBillingService,
	codeGenerator,
)

export const initializeReactModuleUseCase: InitializeReactModuleUseCase = new InitializeReactModule(
	versionControl,
	rspackTemplateRepository,
	codebaseRepository,
)

export const deployToProductionUseCase: DeployToProductionUseCase = new DeployToProduction(
	projectDeploymentService,
	codebaseRepository,
)
