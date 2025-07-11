import { CreateProject } from "@domain/use-cases/project/create-project"
import { PlanTasksWithAI } from "@domain/use-cases/project/plan-tasks-with-ai"
import { UpdateProjectDetails } from "@domain/use-cases/project/update-details"
import { FetchProject } from "@domain/use-cases/project/fetch-project"
import { FetchProjects } from "@domain/use-cases/project/fetch-projects"
import { ArchiveProject } from "@domain/use-cases/project/archive-project"
import { DeployProject } from "@domain/use-cases/project/deploy-project"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { TaskRepository } from "@domain/repositories/task-repository"
import { FrontendDevelopmentService } from "@domain/ports/frontend-development"

import { FetchProjectsUseCase } from "@application/use-cases/project/fetch-projects"
import { DeployProjectUseCase } from "@application/use-cases/project/deploy-project"
import { FetchProjectUseCase } from "@application/use-cases/project/fetch-project"
import { CreateProjectUseCase } from "@application/use-cases/project/create-project"
import { UpdateProjectDetailsUseCase } from "@application/use-cases/project/update-details"
import { ArchiveProjectUseCase } from "@application/use-cases/project/archive-project"

import { TaskController } from "@infrastructure/http/controllers/task-controller"
import { ProjectController } from "@infrastructure/http/controllers/project-controller"

import { DynamoDBProjectRepository } from "@infrastructure/repositories/project-repository"
import { DynamoDBTaskRepository } from "@infrastructure/repositories/task-repository"

import { YarnPackageManager } from "./workflows/frontend-development/services/yarn-package-manager"
import { FrontendDevelopment } from "./workflows/frontend-development/services/fronted-development"
import { PackageManager } from "../domain/ports/package-manager"
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
import { TaskExecutionRepository } from "@domain/repositories/task-execution-repository"
import { FetchTaskExecutionsTimeline } from "@domain/use-cases/task-execution/fetch-timeline"
import { TaskExecutionController } from "./http/controllers/task-execution-controller"
import { FrontendDevelopmentUseCase } from "@application/use-cases/task-execution/frontend-development"
import { RunTaskExecution } from "@domain/use-cases/task-execution/run"
import { FetchTaskExecutionsHeatmap } from "@domain/use-cases/task-execution/fetch-heatmap"
import { FetchTaskExecutionsHeatmapUseCase } from "@application/use-cases/task-execution/fetch-heatmap"
import { FetchTimelineByProjectIdUseCase } from "@application/use-cases/task-execution/fetch-project-timeline"
import { FetchTimelineByAccountIdUseCase } from "@application/use-cases/task-execution/fetch-account-timeline"
import { FileSystemPort } from "../domain/ports/file-system"
import { LocalFileSystem } from "./workflows/frontend-development/services/local-file-system"
import { S3FileStorage } from "./workflows/frontend-development/services/s3-file-storage"
import { FileStorage } from "../domain/ports/file-storage"
import { MockTaskExecutionRepository } from "./repositories/mock-task-execution-repository"
import { PlanTasksWithAIUseCase } from "@application/use-cases/project/plan-tasks-with-ai"
import { ProjectService } from "@domain/ports/project-service"
import { DefaultProjectService } from "@application/services/project-service"
import { ProductOwner } from "./ai/openai/product-owner"
import { Contributor } from "@domain/ports/contirbutor"
import { ReactDeveloper } from "./ai/openai/react-developer"
import { GraphicDesigner } from "./ai/openai/graphic-designer"
import { Marketeer } from "./ai/openai/marketeer"
import { ScrumMaster } from "./ai/openai/scrum-master"
import { TeamService } from "@domain/ports/team-service"
import { FrontendTeam } from "@application/services/frontend-team"

// Controllers
export const projectController = new ProjectController()
export const taskController = new TaskController()
export const taskExecutionController = new TaskExecutionController()

// Services
export const fileSystem: FileSystemPort = new LocalFileSystem()
export const yarnPackageManager: PackageManager = new YarnPackageManager()
export const fileStorage: FileStorage = new S3FileStorage()
export const frontendDevelopmentService: FrontendDevelopmentService = new FrontendDevelopment(yarnPackageManager, fileSystem, fileStorage)


// Repositories
export const projectRepository: ProjectRepository = new DynamoDBProjectRepository()
export const taskRepository: TaskRepository = new DynamoDBTaskRepository()
export const taskExecutionRepository: TaskExecutionRepository = new MockTaskExecutionRepository()

// Contributors
export const scrumMaster: Contributor = new ScrumMaster()
export const productOwner: Contributor = new ProductOwner(taskRepository)
export const reactDeveloper: Contributor = new ReactDeveloper(frontendDevelopmentService, projectRepository, taskRepository, taskExecutionRepository)
export const graphicDesigner: Contributor = new GraphicDesigner(frontendDevelopmentService, projectRepository, taskRepository, taskExecutionRepository)
export const marketeer: Contributor = new Marketeer()
export const frontendTeam: TeamService = new FrontendTeam(graphicDesigner, reactDeveloper, scrumMaster)

// Services
export const projectService: ProjectService = new DefaultProjectService(marketeer, projectRepository)

// Use Cases
export const createNewProject: CreateProject = new CreateProjectUseCase(projectRepository, frontendDevelopmentService)
export const planTasksWithAI: PlanTasksWithAI = new PlanTasksWithAIUseCase(productOwner, projectService)
export const fetchProject: FetchProject = new FetchProjectUseCase(projectRepository)
export const fetchProjects: FetchProjects = new FetchProjectsUseCase(projectRepository)
export const deployProject: DeployProject = new DeployProjectUseCase(frontendDevelopmentService, projectRepository)
export const archiveProject: ArchiveProject = new ArchiveProjectUseCase(projectRepository)
export const createTask: CreateTask = new CreateTaskUseCase(taskRepository, projectService)
export const fetchTasks: FetchTasks = new FetchTasksUseCase(taskRepository)
export const updateTaskTitle: UpdateTaskTitle = new UpdateTaskTitleUseCase(taskRepository)
export const updateTaskDescription: UpdateTaskDescription = new UpdateTaskDescriptionUseCase(taskRepository)
export const updateProjectDetails: UpdateProjectDetails = new UpdateProjectDetailsUseCase(projectRepository)
export const leaveComment: LeaveComment = new LeaveCommentUseCase(taskRepository)
export const fetchTimelineByProjectId: FetchTaskExecutionsTimeline = new FetchTimelineByProjectIdUseCase(taskExecutionRepository)
export const fetchTimelineByAccountId:  FetchTaskExecutionsTimeline = new FetchTimelineByAccountIdUseCase(taskExecutionRepository)
export const fetchTaskExecutionsHeatmap: FetchTaskExecutionsHeatmap = new FetchTaskExecutionsHeatmapUseCase(taskExecutionRepository)
export const frontendDevelopment: RunTaskExecution = new FrontendDevelopmentUseCase(taskRepository, taskExecutionRepository, frontendTeam)