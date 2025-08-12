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
import { LeaveCommentUseCase } from "@application/use-cases/task/leave-comment"
import { UpdateTaskDescriptionUseCase } from "@application/use-cases/task/update-description"
import { UpdateTaskTitleUseCase } from "@application/use-cases/task/update-title"
import { LeaveComment } from "@domain/use-cases/task/leave-comment"
import { TaskExecutionRepository } from "@domain/ports/repositories/task-execution-repository"
import { FetchTaskExecutionsTimeline } from "@domain/use-cases/task-execution/fetch-timeline"
import { TaskExecutionController } from "./http/controllers/task-execution-controller"
import { FrontendDevelopmentUseCase } from "@application/use-cases/task/frontend-development"
import { RunTaskExecution } from "@domain/use-cases/task-execution/run"
import { FetchTaskExecutionsHeatmap } from "@domain/use-cases/task-execution/fetch-heatmap"
import { FetchTaskExecutionsHeatmapUseCase } from "@application/use-cases/task-execution/fetch-heatmap"
import { FetchTimelineByProjectIdUseCase } from "@application/use-cases/task-execution/fetch-project-timeline"
import { FetchTimelineByAccountIdUseCase } from "@application/use-cases/task-execution/fetch-account-timeline"

import { MockTaskExecutionRepository } from "@infrastructure/adapters/repositories/mock-task-execution-repository"
import { DynamoDBTaskExecutionRepository } from "@infrastructure/adapters/repositories/dynamodb-task-execution-repository"
import { PlanTasksWithAIUseCase } from "@application/use-cases/project/plan-tasks-with-ai"
import { MarketingService } from "@domain/ports/services/marketing-service"
import { Contributor } from "@domain/ports/ai/contributor"
import { Team } from "@domain/ports/ai/team"
import { FrontendTeam } from "@application/services/frontend-team"
import { ProjectRepository } from "@domain/ports/repositories/project-repository"
import { TaskRepository } from "@domain/ports/repositories/task-repository"
import { DefaultMarketingService } from "@application/services/marketing-service"
import { VersionRepository } from "@domain/ports/repositories/version-repository"
import { VersionControlSystem } from "@domain/ports/version-control-system"
import { CompressorService } from "@domain/ports/compressor-service"
import { Bundler } from "@domain/ports/bundlers/bundler"
import RspackBundler from "@infrastructure/adapters/bundlers/rspack-bundler"
import { DynamoDBVersionRepository } from "@infrastructure/adapters/repositories/version-repository"
import { FileSelectionFilter } from "@domain/ports/filesystem/file-selection-filter"
import { SourceCodeFilter } from "@infrastructure/adapters/filesystem/filters/source-code-filter"
import { DistFolderFilter } from "@infrastructure/adapters/filesystem/filters/dist-folder-filter"
import { Template } from "@domain/ports/templates/template"
import { RspackTemplate } from "@infrastructure/adapters/templates/rspack-template"
import { ScrumMaster } from "@infrastructure/adapters/ai/openai/scrum-master"
import { FileSystemPort } from "@domain/ports/filesystem/file-system"
import { LocalFileSystem } from "@infrastructure/adapters/filesystem/local-file-system"
import { YarnPackageManager } from "@infrastructure/adapters/package-managers/yarn-package-manager"
import { FileStorage } from "@infrastructure/ports/file-storage"
import { S3FileStorage } from "@infrastructure/adapters/s3-file-storage"
import { TarGzCompressorService } from "@infrastructure/adapters/targz-compressor-service"
import { ProductOwner } from "@infrastructure/adapters/ai/openai/product-owner"
import { ReactDeveloper } from "@infrastructure/adapters/ai/openai/react-developer"
import { GraphicDesigner } from "@infrastructure/adapters/ai/openai/graphic-designer"
import { Marketeer } from "@infrastructure/adapters/ai/openai/marketeer"
import { WebHostingService } from "@domain/ports/services/web-hosting-service"
import { S3HostingService } from "@application/services/s3-hosting-service"
import { LocalDevEnvironment } from "@application/services/local-dev-environment"
import { DevEnvironment } from "@domain/ports/services/dev-environment"
import { S3VersionControlSystem } from "@infrastructure/adapters/s3-version-control-system"
import { InMemoryVersionControlSystem } from "./adapters/in-memory-version-control-system"

// Controllers
export const projectController = new ProjectController()
export const taskController = new TaskController()
export const taskExecutionController = new TaskExecutionController()

// Services
export const fileSystem: FileSystemPort = new LocalFileSystem()
export const yarnPackageManager: PackageManager = new YarnPackageManager()
export const fileStorage: FileStorage = new S3FileStorage()
export const hostingService: WebHostingService = new S3HostingService(fileStorage)   
export const compressorService: CompressorService = new TarGzCompressorService()


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
export const versionRepository: VersionRepository = new DynamoDBVersionRepository()


export const versionControlSystem: VersionControlSystem = new S3VersionControlSystem(fileStorage, compressorService, versionRepository)
export const inMemoryVersionControlSystem: VersionControlSystem = new InMemoryVersionControlSystem()
export const localDevEnvironment: DevEnvironment = new LocalDevEnvironment(rspackBundler, fileSystem)

// Contributors
export const scrumMaster: Contributor = new ScrumMaster()
export const productOwner: Contributor = new ProductOwner(taskRepository)
export const reactDeveloper: Contributor = new ReactDeveloper(localDevEnvironment)
export const graphicDesigner: Contributor = new GraphicDesigner(taskRepository, taskExecutionRepository)
export const marketeer: Contributor = new Marketeer()
export const frontendTeam: Team = new FrontendTeam(graphicDesigner, reactDeveloper, scrumMaster)


export const marketingService: MarketingService = new DefaultMarketingService(marketeer, projectRepository)

// Use Cases
export const createNewProject: CreateProject = new CreateProjectUseCase(projectRepository, rspackTemplate, hostingService, versionControlSystem)
export const planTasksWithAI: PlanTasksWithAI = new PlanTasksWithAIUseCase(productOwner, marketingService, projectRepository)
export const fetchProject: FetchProject = new FetchProjectUseCase(projectRepository)
export const fetchProjects: FetchProjects = new FetchProjectsUseCase(projectRepository)
export const deployProject: DeployProject = new DeployProjectUseCase(projectRepository, versionControlSystem, hostingService)
export const archiveProject: ArchiveProject = new ArchiveProjectUseCase(projectRepository)
export const createTask: CreateTask = new CreateTaskUseCase(taskRepository, marketingService)
export const fetchTasks: FetchTasks = new FetchTasksUseCase(taskRepository)
export const updateTaskTitle: UpdateTaskTitle = new UpdateTaskTitleUseCase(taskRepository)
export const updateTaskDescription: UpdateTaskDescription = new UpdateTaskDescriptionUseCase(taskRepository)
export const updateProjectDetails: UpdateProjectDetails = new UpdateProjectDetailsUseCase(projectRepository)
export const leaveComment: LeaveComment = new LeaveCommentUseCase(taskRepository)
export const fetchTimelineByProjectId: FetchTaskExecutionsTimeline = new FetchTimelineByProjectIdUseCase(taskExecutionRepository)
export const fetchTimelineByAccountId:  FetchTaskExecutionsTimeline = new FetchTimelineByAccountIdUseCase(taskExecutionRepository)
export const fetchTaskExecutionsHeatmap: FetchTaskExecutionsHeatmap = new FetchTaskExecutionsHeatmapUseCase(taskExecutionRepository)
export const taskRunner: RunTaskExecution = new FrontendDevelopmentUseCase(taskRepository, taskExecutionRepository, frontendTeam, hostingService, versionControlSystem, projectRepository)