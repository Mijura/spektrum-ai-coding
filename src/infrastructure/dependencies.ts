import { CreateProject } from "@domain/use-cases/project/create-project"
import { UpdateProjectDetails } from "@domain/use-cases/project/update-details"
import { FetchProject } from "@domain/use-cases/project/fetch-project"
import { FetchProjects } from "@domain/use-cases/project/fetch-projects"
import { ArchiveProject } from "@domain/use-cases/project/archive-project"
import { DeployProject } from "@domain/use-cases/project/deploy-project"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { TaskRepository } from "@domain/repositories/task-repository"
import { FrontendDevelopmentService } from "@domain/services/frontend-development"
import { FileSystemPort } from "@domain/services/file-system"

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

import { PrototypingWorkflow } from "./workflows/prototyping/main"
import { LocalFileSystem } from "./workflows/prototyping/services/local-file-system"
import { YarnPackageManager } from "./workflows/prototyping/services/yarn-package-manager"
import { FrontendDevelopment } from "./workflows/prototyping/services/fronted-development"
import { PackageManager } from "./workflows/prototyping/interfaces/package-manager"
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
import { FetchWorkflowRunsTimeline } from "@domain/use-cases/workflow-run/fetch-timeline"
import { WorkflowRunController } from "./http/controllers/workflow-run-controller"
import { RunPrototypingWorkflowUseCase } from "@application/use-cases/workflow-run/run-prototyping-worfklow"
import { RunPrototypingWorkflow } from "@domain/use-cases/workflow-run/run-prototyping-workflow"
import { ProjectRefiningWorkflow } from "./workflows/project-refining/main"
import { WorkflowPort } from "@domain/workflows/workflow-port"
import { FetchWorkflowRunsHeatmap } from "@domain/use-cases/workflow-run/fetch-heatmap"
import { FetchWorkflowRunsHeatmapUseCase } from "@application/use-cases/workflow-run/fetch-heatmap"
import { FetchTimelineByProjectIdUseCase } from "@application/use-cases/workflow-run/fetch-project-timeline"
import { FetchTimelineByAccountIdUseCase } from "@application/use-cases/workflow-run/fetch-account-timeline"

// Controllers
export const projectController = new ProjectController()
export const taskController = new TaskController()
export const workflowRunController = new WorkflowRunController()

// Services
export const fileSystem: FileSystemPort = new LocalFileSystem()
export const yarnPackageManager: PackageManager = new YarnPackageManager()
export const frontendDevelopmentService: FrontendDevelopmentService = new FrontendDevelopment(yarnPackageManager, fileSystem)


// Repositories
export const projectRepository: ProjectRepository = new DynamoDBProjectRepository()
export const taskRepository: TaskRepository = new DynamoDBTaskRepository()
export const workflowRunRepository: WorkflowRunRepository = new OpenSearchWorkflowRunRepository()

// Workflows
export const prototypingWorkflow: WorkflowPort = new PrototypingWorkflow()
export const projectRefiningWorkflow: WorkflowPort = new ProjectRefiningWorkflow()
// Use Cases
export const createNewProject: CreateProject = new CreateProjectUseCase(frontendDevelopmentService, projectRepository)
export const fetchProject: FetchProject = new FetchProjectUseCase(projectRepository)
export const fetchProjects: FetchProjects = new FetchProjectsUseCase(projectRepository)
export const deployProject: DeployProject = new DeployProjectUseCase(frontendDevelopmentService, projectRepository)
export const archiveProject: ArchiveProject = new ArchiveProjectUseCase(projectRepository)
export const createTask: CreateTask = new CreateTaskUseCase(taskRepository, projectRepository, projectRefiningWorkflow)
export const fetchTasks: FetchTasks = new FetchTasksUseCase(taskRepository)
export const updateTaskTitle: UpdateTaskTitle = new UpdateTaskTitleUseCase(taskRepository)
export const updateTaskDescription: UpdateTaskDescription = new UpdateTaskDescriptionUseCase(taskRepository)
export const updateProjectDetails: UpdateProjectDetails = new UpdateProjectDetailsUseCase(projectRepository)
export const leaveComment: LeaveComment = new LeaveCommentUseCase(taskRepository)
export const fetchTimelineByProjectId: FetchWorkflowRunsTimeline = new FetchTimelineByProjectIdUseCase(workflowRunRepository)
export const fetchTimelineByAccountId: FetchWorkflowRunsTimeline = new FetchTimelineByAccountIdUseCase(workflowRunRepository)
export const fetchWorkflowRunsHeatmap: FetchWorkflowRunsHeatmap = new FetchWorkflowRunsHeatmapUseCase(workflowRunRepository)
export const runPrototypingWorkflow: RunPrototypingWorkflow = new RunPrototypingWorkflowUseCase(taskRepository, prototypingWorkflow)
