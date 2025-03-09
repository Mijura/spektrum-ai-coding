import { LocalFileSystem } from "@infrastructure/persistence/local-file-system"
import { YarnPackageManager } from "@infrastructure/utils/yarn-package-manager"
import { DynamoDBProjectRepository } from "@infrastructure/persistence/dynamodb/project-repository"
import { LangGraphCodeGeneration } from "@infrastructure/workflows/code-generation/langgraph/langgraph-generate-code"

// Use Cases
import { CreateNewProject } from "@application/use-cases/create-new-project"
import { FetchProjectDetails } from "@application/use-cases/fetch-project-details"

// Ports
import { FileSystemPort } from "@domain/persistence/file-system"
import { PackageManager } from "@domain/utils/package-manager"
import { ProjectStorage } from "@domain/persistence/project-storage"
import { CodeGenerationWorkflow } from "@domain/workflows/code-generation"
import { ProjectController } from "@infrastructure/web/controllers/project-controller"
import { FrontendDevelopmentService } from "@application/services/fronted-development"
import { DevelopUserRequest } from "@application/use-cases/develop-user-request"

// Concrete implementations
export const fileSystem: FileSystemPort = new LocalFileSystem()
export const yarnPackageManager: PackageManager = new YarnPackageManager()
export const projectStorage: ProjectStorage = new DynamoDBProjectRepository()
export const frontendDevelopmentService: FrontendDevelopmentService = new FrontendDevelopmentService(yarnPackageManager, fileSystem)
export const codeGenerationWorkflow: CodeGenerationWorkflow = new LangGraphCodeGeneration(frontendDevelopmentService)

export const projectController = new ProjectController(frontendDevelopmentService)

// Use Case Instances
export const createNewProject = new CreateNewProject(frontendDevelopmentService, projectStorage)
export const fetchProjectDetails = new FetchProjectDetails(projectStorage)
export const developUserRequest = new DevelopUserRequest(projectStorage, codeGenerationWorkflow)