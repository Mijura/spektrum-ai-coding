import { DevelopUseCase } from "@application/use-cases/develop"
import { Develop } from "@application/ports/use-cases/develop"

import { Bundler } from "@application/ports/services/bundler"
import { RspackBundler } from "@infrastructure/services/bundler/rspack-bundler"
import { FileSelectionFilter } from "@infrastructure/services/filesystem/file-selection-filter"
import { SourceCodeFilter } from "@infrastructure/shared/filters/source-code-filter"
import { DistFolderFilter } from "@infrastructure/shared/filters/dist-folder-filter"
import { TemplateRepositoryPort } from "@application/ports/repositories/template-repository"
import { RspackTemplateRepository } from "@infrastructure/repositories/template/rspack-template-repository"
import { YarnPackageManager } from "@infrastructure/services/bundler/yarn-package-manager"
import { LocalDevEnvironment } from "@application/services/local-dev-environment"
import { AICodingController } from "./http/controllers/ai-coding-controller"
import { InitializeReactModuleUseCase } from "@application/use-cases/initialize-react-module"
import { ModuleController } from "./http/controllers/module-controller"
import { FileSystemPort } from "@application/ports/services/file-system"
import { LocalFileSystem } from "@infrastructure/services/filesystem/local-file-system"
import { CodebaseRepositoryPort } from "@application/ports/repositories/codebase-repository"
import { DynamoDBCodebaseRepository } from "@infrastructure/repositories/codebase/codebase-repository"
import { InitializeReactModule } from "@application/ports/use-cases/initialize-react-module"
import { JigJoyVCS } from "./services/version-control/jigjoy-vcs"
import { VersionControlPort } from "@application/ports/services/version-control"
import { ProjectDeploymentClient } from "@jigjoy-io/project-deployment-client"
import { DeployToProductionUseCase } from "@application/use-cases/deploy-to-production"
import { DeployToProduction } from "@application/ports/use-cases/deploy-to-production"
import { ObservabilityClient } from "@jigjoy-io/observability-client"
import { ProjectPlanningClient } from "@jigjoy-io/project-planning-client"

// Controllers
export const aiCodingController = new AICodingController()
export const moduleController = new ModuleController()

// Services
export const fileSystem: FileSystemPort = new LocalFileSystem()
export const yarnPackageManager: YarnPackageManager = new YarnPackageManager()

// Filters
export const sourceCodeFilter: FileSelectionFilter = new SourceCodeFilter(fileSystem)
export const distFolderFilter: FileSelectionFilter = new DistFolderFilter(fileSystem)

// Bundlers
export const rspackBundler: Bundler = new RspackBundler(yarnPackageManager, distFolderFilter)

// Templates
export const rspackTemplateRepository: TemplateRepositoryPort = new RspackTemplateRepository(sourceCodeFilter, distFolderFilter)

export const localDevEnvironment: LocalDevEnvironment = new LocalDevEnvironment(rspackBundler, fileSystem)

export const codebaseRepository: CodebaseRepositoryPort = new DynamoDBCodebaseRepository()

const versionControl: VersionControlPort = new JigJoyVCS()

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
export const develop: Develop = new DevelopUseCase(
	versionControl,
	localDevEnvironment,
	codebaseRepository,
	projectDeploymentClient,
	observabilityClient,
	projectPlanningClient,
)

export const initializeReactModule: InitializeReactModule = new InitializeReactModuleUseCase(
	versionControl,
	rspackTemplateRepository,
	codebaseRepository,
)

export const deployToProduction: DeployToProduction = new DeployToProductionUseCase(
	projectDeploymentClient,
	codebaseRepository,
)
