import { PackageManager } from "@infrastructure/ports/package-manager"
import { DevelopUseCase } from "@application/use-cases/develop"
import { Develop } from "@application/ports/use-cases/develop"

import { Bundler } from "@application/ports/outbound/bundler"
import RspackBundler from "@infrastructure/adapters/bundlers/rspack-bundler"
import { FileSelectionFilter } from "@application/ports/outbound/file-selection-filter"
import { SourceCodeFilter } from "@infrastructure/adapters/filesystem/filters/source-code-filter"
import { DistFolderFilter } from "@infrastructure/adapters/filesystem/filters/dist-folder-filter"
import { TemplateService } from "@application/ports/outbound/template-service"
import { RspackTemplateService } from "@infrastructure/templates/rspack-template-service"
import { YarnPackageManager } from "@infrastructure/adapters/package-managers/yarn-package-manager"
import { LocalDevEnvironment } from "@application/services/local-dev-environment"
import { ProjectVersioningClient } from "@jigjoy-io/project-versioning-client"
import { AICodingController } from "./http/controllers/ai-coding-controller"
import { InitializeReactModuleUseCase } from "@application/use-cases/initialize-react-module"
import { ModuleController } from "./http/controllers/module-controller"
import { FileSystemPort } from "@application/ports/outbound/file-system"
import { LocalFileSystem } from "@infrastructure/adapters/filesystem/local-file-system"
import { CodebaseRepositoryPort } from "@application/ports/outbound/codebase-repository"
import { DynamoDBCodebaseRepository } from "./storage/codebase-repository"
import { InitializeReactModule } from "@application/ports/use-cases/initialize-react-module"
import { DefaultVersionControl } from "./storage/version-control"
import { VersionControlPort } from "@application/ports/outbound/version-control"
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
export const yarnPackageManager: PackageManager = new YarnPackageManager()

// Filters
export const sourceCodeFilter: FileSelectionFilter = new SourceCodeFilter(fileSystem)
export const distFolderFilter: FileSelectionFilter = new DistFolderFilter(fileSystem)

// Bundlers
export const rspackBundler: Bundler = new RspackBundler(yarnPackageManager, distFolderFilter)

// Templates
export const rspackTemplate: TemplateService = new RspackTemplateService(sourceCodeFilter, distFolderFilter)

export const localDevEnvironment: LocalDevEnvironment = new LocalDevEnvironment(rspackBundler, fileSystem)

export const codebaseRepository: CodebaseRepositoryPort = new DynamoDBCodebaseRepository()

const projectVersioningEndpoint = process.env.PROJECT_VERSIONING_ENDPOINT
if (!projectVersioningEndpoint) {
	throw new Error("PROJECT_VERSIONING_ENDPOINT is not set")
}

const projectVersioningClient = new ProjectVersioningClient(projectVersioningEndpoint)
const versionControl: VersionControlPort = new DefaultVersionControl(projectVersioningClient)

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
	rspackTemplate,
	codebaseRepository,
)

export const deployToProduction: DeployToProduction = new DeployToProductionUseCase(projectDeploymentClient, codebaseRepository)
