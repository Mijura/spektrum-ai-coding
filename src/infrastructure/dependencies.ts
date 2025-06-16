import { CreateProject } from "@domain/use-cases/project/create-project"
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
import { PackageManager } from "./workflows/frontend-development/interfaces/package-manager"
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
import { WorkflowRunRepository } from "@domain/repositories/workflow-run-repository"
import { OpenSearchWorkflowRunRepository } from "./repositories/workflow-run-repository"
import { FetchWorkflowRunsTimeline } from "@domain/use-cases/workflow/fetch-timeline"
import { WorkflowController } from "./http/controllers/workflow-controller"
import { RunWorkflowUseCase } from "@application/use-cases/workflow/run-workflow"
import { RunWorkflow } from "@domain/use-cases/workflow/run-workflow"
import { FetchWorkflowRunsHeatmap } from "@domain/use-cases/workflow/fetch-heatmap"
import { FetchWorkflowRunsHeatmapUseCase } from "@application/use-cases/workflow/fetch-heatmap"
import { FetchTimelineByProjectIdUseCase } from "@application/use-cases/workflow/fetch-project-timeline"
import { FetchTimelineByAccountIdUseCase } from "@application/use-cases/workflow/fetch-account-timeline"
import { FileSystemPort } from "./workflows/frontend-development/interfaces/file-system"
import { WorkflowRunner } from "@domain/ports/workflow-runner"
import { WorkflowRegistry } from "@domain/repositories/workflow-registry"
import { InMemoryWorkflowRegistry } from "./repositories/workflow-registry"
import { WorkflowType } from "@domain/types/workflow"
import { NodeFileSystem } from "./workflows/frontend-development/services/node-file-system"
import { S3DeploymentTargetAdapter } from "./workflows/frontend-development/services/s3-deployment-target"
import { DeploymentTargetPort } from "./workflows/frontend-development/interfaces/deployment-target"
import { FrontendDevelopmentRunner } from "./workflows/frontend-development/runner"
import { ProjectRefiningRunner } from "./workflows/project-refining/runner"
import { KeyboardPriceSyncRunner } from "./workflows/scraping-workflow/runner"

// Controllers
export const projectController = new ProjectController()
export const taskController = new TaskController()
export const workflowRunController = new WorkflowController()

// Services
export const fileSystem: FileSystemPort = new NodeFileSystem()
export const yarnPackageManager: PackageManager = new YarnPackageManager()
export const deploymentTarget: DeploymentTargetPort = new S3DeploymentTargetAdapter()
export const frontendDevelopmentService: FrontendDevelopmentService = new FrontendDevelopment(yarnPackageManager, fileSystem, deploymentTarget)


// Repositories
export const projectRepository: ProjectRepository = new DynamoDBProjectRepository()
export const taskRepository: TaskRepository = new DynamoDBTaskRepository()
export const workflowRunRepository: WorkflowRunRepository = new OpenSearchWorkflowRunRepository()
export const workflowRegistry: WorkflowRegistry = new InMemoryWorkflowRegistry()

// Workflows
export const frontendDevelopmentRunner: WorkflowRunner = new FrontendDevelopmentRunner()
export const projectRefiningRunner: WorkflowRunner = new ProjectRefiningRunner()
//export const scrapingRunner: WorkflowRunner = new KeyboardPriceSyncRunner()
// Register workflows
workflowRegistry.registerWorkflow(WorkflowType.FRONTEND_DEVELOPMENT, frontendDevelopmentRunner)

// Use Cases
export const createNewProject: CreateProject = new CreateProjectUseCase(projectRepository, frontendDevelopmentService)
export const fetchProject: FetchProject = new FetchProjectUseCase(projectRepository)
export const fetchProjects: FetchProjects = new FetchProjectsUseCase(projectRepository)
export const deployProject: DeployProject = new DeployProjectUseCase(frontendDevelopmentService, projectRepository)
export const archiveProject: ArchiveProject = new ArchiveProjectUseCase(projectRepository)
export const createTask: CreateTask = new CreateTaskUseCase(taskRepository, projectRepository, projectRefiningRunner)
export const fetchTasks: FetchTasks = new FetchTasksUseCase(taskRepository)
export const updateTaskTitle: UpdateTaskTitle = new UpdateTaskTitleUseCase(taskRepository)
export const updateTaskDescription: UpdateTaskDescription = new UpdateTaskDescriptionUseCase(taskRepository)
export const updateProjectDetails: UpdateProjectDetails = new UpdateProjectDetailsUseCase(projectRepository)
export const leaveComment: LeaveComment = new LeaveCommentUseCase(taskRepository)
export const fetchTimelineByProjectId: FetchWorkflowRunsTimeline = new FetchTimelineByProjectIdUseCase(workflowRunRepository)
export const fetchTimelineByAccountId: FetchWorkflowRunsTimeline = new FetchTimelineByAccountIdUseCase(workflowRunRepository)
export const fetchWorkflowRunsHeatmap: FetchWorkflowRunsHeatmap = new FetchWorkflowRunsHeatmapUseCase(workflowRunRepository)
export const runWorkflow: RunWorkflow = new RunWorkflowUseCase(taskRepository, workflowRegistry)
