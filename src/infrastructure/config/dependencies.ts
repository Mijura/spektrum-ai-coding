import { FileSystem } from "@infrastructure/persistence/file-system-adapter"
import { YarnPackageManager } from "@infrastructure/utils/yarn-package-manager"
import { DynamoDBProjectStorage } from "@infrastructure/persistence/dynamodb-project-storage"
import { LangGraphWebDevelopment } from "@infrastructure/workflows/web-development/langgraph/langgraph-web-development"

// Use Cases
import { CreateNewProject } from "@application/use-cases/create-new-project"
import { FetchProjectDetails } from "@application/use-cases/fetch-project-details"

// Ports
import { FileSystemPort } from "@domain/utils/file-system"
import { PackageManager } from "@domain/utils/package-manager"
import { ProjectStorage } from "@domain/persistence/project-storage"
import { WebDevelopmentWorkflow } from "@domain/workflows/web-development-workflow"
import { ProjectController } from "@infrastructure/web/controllers/project-controller"
import { FrontendDevelopmentService } from "@application/services/fronted-development-service"

// Concrete implementations
export const fileSystemAdapter: FileSystemPort = new FileSystem()
export const yarnPackageManager: PackageManager = new YarnPackageManager()
export const projectStorage: ProjectStorage = new DynamoDBProjectStorage()
export const frontendDevelopmentService: FrontendDevelopmentService = new FrontendDevelopmentService(yarnPackageManager, fileSystemAdapter, webDevelopmentWorkflow)
export const projectWorkflow: WebDevelopmentWorkflow = new LangGraphWebDevelopment(yarnPackageManager, fileSystemAdapter, projectStorage)
export const projectController = new ProjectController(projectService)

// Use Case Instances
export const createNewProject = new CreateNewProject(projectService, projectStorage)
export const fetchProjectDetails = new FetchProjectDetails(projectStorage)
export const runWorkflow = new RunWorkflow(projectWorkflow)