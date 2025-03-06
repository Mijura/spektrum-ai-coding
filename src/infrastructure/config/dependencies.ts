import { FileSystemAdapter } from "@infrastructure/persistence/file-system-adapter"
import { YarnPackageManager } from "@infrastructure/utils/yarn-package-manager"
import { DynamoDBProjectRepository } from "@infrastructure/persistence/dynamodb-project-repository"
import { LangGraphWebDevelopment } from "@infrastructure/workflows/langgraph/langgraph-web-development"
import { ProjectService } from "@domain/services/project-service"

// Use Cases
import { CreateNewProject } from "@application/use-cases/create-new-project"
import { FetchProjectDetails } from "@application/use-cases/fetch-project-details"
import { RunWorkflow } from "@application/use-cases/run-workflow"

// Ports
import { FileSystemPort } from "@domain/ports/outbound/file-system"
import { GithubService } from "@domain/ports/outbound/github-service"
import { PackageManager } from "@domain/ports/outbound/package-manager"
import { ProjectRepository } from "@domain/ports/outbound/project-repository"
import { WebDevelopmentWorkflow } from "@domain/ports/outbound/web-development-workflow"
import { ProjectController } from "@infrastructure/web/controllers/project-controller"

// Concrete implementations
export const fileSystemAdapter: FileSystemPort = new FileSystemAdapter()
export const githubService: GithubService = new GithubService(fileSystemAdapter)
export const yarnPackageManager: PackageManager = new YarnPackageManager()
export const projectRepository: ProjectRepository = new DynamoDBProjectRepository()
export const projectService: ProjectService = new ProjectService(githubService, yarnPackageManager, fileSystemAdapter)
export const projectWorkflow: WebDevelopmentWorkflow = new LangGraphWebDevelopment(yarnPackageManager, fileSystemAdapter, projectRepository)
export const projectController = new ProjectController(projectService)

// Use Case Instances
export const createNewProject = new CreateNewProject(projectService, projectRepository)
export const fetchProjectDetails = new FetchProjectDetails(projectRepository)
export const runWorkflow = new RunWorkflow(projectWorkflow)