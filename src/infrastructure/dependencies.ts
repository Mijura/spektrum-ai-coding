import { CreateProject } from "@domain/use-cases/project/create-project"
import { PlanTasksWithAI } from "@domain/use-cases/project/plan-tasks-with-ai"
import { UpdateProjectDetails } from "@domain/use-cases/project/update-details"
import { FetchProject } from "@domain/use-cases/project/fetch-project"
import { FetchProjects } from "@domain/use-cases/project/fetch-projects"
import { ArchiveProject } from "@domain/use-cases/project/archive-project"
import { DeployProject } from "@domain/use-cases/project/deploy-project"

import { FetchProjectsUseCase } from "@application/use-cases/project/fetch-projects"
import { DeployProjectUseCase } from "@application/use-cases/project/deploy-project"
import { FetchProjectUseCase } from "@application/use-cases/project/fetch-project"
import { CreateProjectUseCase } from "@application/use-cases/project/create-project"
import { UpdateProjectDetailsUseCase } from "@application/use-cases/project/update-details"
import { ArchiveProjectUseCase } from "@application/use-cases/project/archive-project"

import { TaskController } from "@infrastructure/http/controllers/task-controller"
import { ProjectController } from "@infrastructure/http/controllers/project-controller"

import { DynamoDBProjectRepository } from "@infrastructure/adapters/repositories/project-repository"
import { DynamoDBTaskRepository } from "@infrastructure/adapters/repositories/task-repository"


import { PackageManager } from "@infrastructure/ports/package-manager"
import { CreateTask } from "@domain/use-cases/task/create-task"
import { FetchTasks } from "@domain/use-cases/task/fetch-tasks"
import { UpdateTaskTitle } from "@domain/use-cases/task/update-title"
import { UpdateTaskDescription } from "@domain/use-cases/task/update-description"
import { CreateTaskUseCase } from "@application/use-cases/task/create-task"
import { FetchTasksUseCase } from "@application/use-cases/task/fetch-tasks"
import { CommentAndDevelopUseCase } from "@application/use-cases/task/comment-and-develop"
import { UpdateTaskDescriptionUseCase } from "@application/use-cases/task/update-description"
import { UpdateTaskTitleUseCase } from "@application/use-cases/task/update-title"
import { TaskExecutionRepository } from "@domain/ports/repositories/task-execution-repository"
import { FetchTaskExecutionsTimeline } from "@domain/use-cases/task-execution/fetch-timeline"
import { TaskExecutionController } from "./http/controllers/task-execution-controller"
import { DevelopUseCase } from "@application/use-cases/task/develop"
import { Develop } from "@domain/use-cases/task-execution/develop"
import { FetchTaskExecutionsHeatmap } from "@domain/use-cases/task-execution/fetch-heatmap"
import { FetchTaskExecutionsHeatmapUseCase } from "@application/use-cases/task-execution/fetch-heatmap"
import { FetchTimelineByProjectIdUseCase } from "@application/use-cases/task-execution/fetch-project-timeline"
import { FetchTimelineByAccountIdUseCase } from "@application/use-cases/task-execution/fetch-account-timeline"

import { DynamoDBTaskExecutionRepository } from "@infrastructure/adapters/repositories/dynamodb-task-execution-repository"
import { PlanTasksWithAIUseCase } from "@application/use-cases/project/plan-tasks-with-ai"
import { MarketingService } from "@domain/ports/services/marketing-service"

import { ProjectRepository } from "@domain/ports/repositories/project-repository"
import { TaskRepository } from "@domain/ports/repositories/task-repository"
import { DefaultMarketingService } from "@application/services/marketing-service"
import { VersionControlSystem } from "@domain/ports/version-control-system"
import { Bundler } from "@domain/ports/bundlers/bundler"
import RspackBundler from "@infrastructure/adapters/bundlers/rspack-bundler"
import { FileSelectionFilter } from "@domain/ports/filesystem/file-selection-filter"
import { SourceCodeFilter } from "@infrastructure/adapters/filesystem/filters/source-code-filter"
import { DistFolderFilter } from "@infrastructure/adapters/filesystem/filters/dist-folder-filter"
import { Template } from "@domain/ports/templates/template"
import { RspackTemplate } from "@infrastructure/adapters/templates/rspack-template"
import { FileSystemPort } from "@domain/ports/filesystem/file-system"
import { LocalFileSystem } from "@infrastructure/adapters/filesystem/local-file-system"
import { YarnPackageManager } from "@infrastructure/adapters/package-managers/yarn-package-manager"
import { ProductOwner } from "@infrastructure/adapters/ai/openai/product-owner"
import { ReactDeveloper } from "@infrastructure/adapters/ai/openai/react-developer"
import { Marketeer } from "@infrastructure/adapters/ai/openai/marketeer"
import { LocalDevEnvironment } from "@application/services/local-dev-environment"
import { DevEnvironment } from "@domain/ports/services/dev-environment"
import { JigJoyVCSAdapter } from "@infrastructure/adapters/jigjoy-vcs"
import { CommentAndDevelop } from "@domain/use-cases/task/comment-and-develop"
import { Agent } from "@domain/agent"

// Controllers
export const projectController = new ProjectController()
export const taskController = new TaskController()
export const taskExecutionController = new TaskExecutionController()

// Services
export const fileSystem: FileSystemPort = new LocalFileSystem()
export const yarnPackageManager: PackageManager = new YarnPackageManager(fileSystem)


// Filters
export const sourceCodeFilter: FileSelectionFilter = new SourceCodeFilter(fileSystem)
export const distFolderFilter: FileSelectionFilter = new DistFolderFilter(fileSystem)

// Bundlers
export const rspackBundler: Bundler = new RspackBundler(yarnPackageManager, distFolderFilter)

// Templates
export const rspackTemplate: Template = new RspackTemplate(sourceCodeFilter, distFolderFilter)

// Repositories
export const projectRepository: ProjectRepository = new DynamoDBProjectRepository()
export const taskRepository: TaskRepository = new DynamoDBTaskRepository()
export const taskExecutionRepository: TaskExecutionRepository = new DynamoDBTaskExecutionRepository()


export const versionControlSystem: VersionControlSystem = new JigJoyVCSAdapter()
export const localDevEnvironment: DevEnvironment = new LocalDevEnvironment(rspackBundler, fileSystem)

// Agents
export const productOwner: Agent = new ProductOwner()
export const reactDeveloper: Agent = new ReactDeveloper(localDevEnvironment, taskRepository)
export const marketeer: Agent = new Marketeer()


export const marketingService: MarketingService = new DefaultMarketingService(marketeer, projectRepository)

// Use Cases
export const createNewProject: CreateProject = new CreateProjectUseCase(projectRepository, rspackTemplate, versionControlSystem)
export const planTasksWithAI: PlanTasksWithAI = new PlanTasksWithAIUseCase(productOwner, marketingService, taskRepository)
export const fetchProject: FetchProject = new FetchProjectUseCase(projectRepository)
export const fetchProjects: FetchProjects = new FetchProjectsUseCase(projectRepository)
export const deployProject: DeployProject = new DeployProjectUseCase(projectRepository, versionControlSystem)
export const archiveProject: ArchiveProject = new ArchiveProjectUseCase(projectRepository)
export const createTask: CreateTask = new CreateTaskUseCase(taskRepository, marketingService)
export const fetchTasks: FetchTasks = new FetchTasksUseCase(taskRepository)
export const updateTaskTitle: UpdateTaskTitle = new UpdateTaskTitleUseCase(taskRepository)
export const updateTaskDescription: UpdateTaskDescription = new UpdateTaskDescriptionUseCase(taskRepository)
export const updateProjectDetails: UpdateProjectDetails = new UpdateProjectDetailsUseCase(projectRepository)
export const leaveComment: CommentAndDevelop = new CommentAndDevelopUseCase(taskRepository)
export const fetchTimelineByProjectId: FetchTaskExecutionsTimeline = new FetchTimelineByProjectIdUseCase(taskExecutionRepository)
export const fetchTimelineByAccountId:  FetchTaskExecutionsTimeline = new FetchTimelineByAccountIdUseCase(taskExecutionRepository)
export const fetchTaskExecutionsHeatmap: FetchTaskExecutionsHeatmap = new FetchTaskExecutionsHeatmapUseCase(taskExecutionRepository)
export const develop: Develop = new DevelopUseCase(taskRepository, taskExecutionRepository, versionControlSystem, projectRepository, reactDeveloper)