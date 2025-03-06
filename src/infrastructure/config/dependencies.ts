import { FileSystemAdapter } from "@infrastructure/adapters/file-system-adapter"
import { GithubService } from "@infrastructure/adapters/github-service"
import { YarnPackageManager } from "@infrastructure/adapters/yarn-package-manager"
import { DynamoDBProjectRepository } from "@infrastructure/adapters/dynamodb-project-repository"
import { LangGraphWebDevelopment } from "@infrastructure/adapters/langgraph-web-development"
import { ProjectService } from "@domain/services/project-service"

// Use Cases
import { CreateNewProject } from "@application/use-cases/create-new-project"
import { FetchProjectDetails } from "@application/use-cases/fetch-project-details"
import { RunWorkflow } from "@application/use-cases/run-workflow"

// Ports
import { FileSystemPort } from "@domain/ports/outbound/file-system-port"
import { GithubServicePort } from "@domain/ports/outbound/github-service-port"
import { PackageManagerPort } from "@domain/ports/outbound/package-manager-port"
import { ProjectRepository } from "@domain/ports/outbound/project-repository"
import { WebDevelopmentWorkflow } from "@domain/ports/outbound/web-development-workflow"
import { ProjectController } from "@infrastructure/web/controllers/project-controller"

// Concrete implementations
export const fileSystemAdapter: FileSystemPort = new FileSystemAdapter()
export const githubService: GithubServicePort = new GithubService(fileSystemAdapter)
export const yarnPackageManager: PackageManagerPort = new YarnPackageManager()
export const projectRepository: ProjectRepository = new DynamoDBProjectRepository()
export const projectService: ProjectService = new ProjectService(githubService, yarnPackageManager)
export const projectWorkflow: WebDevelopmentWorkflow = new LangGraphWebDevelopment(yarnPackageManager, fileSystemAdapter, projectRepository)
export const projectController = new ProjectController(projectService)

// Use Case Instances
export const createNewProject = new CreateNewProject(projectService, projectRepository)
export const fetchProjectDetails = new FetchProjectDetails(projectRepository)
export const runWorkflow = new RunWorkflow(projectWorkflow)