import { CreateProject } from "@domain/use-cases/project/create-project"
import { UpdateProjectDetails } from "@domain/use-cases/project/update-details"
import { FetchProject } from "@domain/use-cases/project/fetch-project"
import { FetchProjects } from "@domain/use-cases/project/fetch-projects"
import { ArchiveProject } from "@domain/use-cases/project/archive-project"
import { DeployProject } from "@domain/use-cases/project/deploy-project"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { IssueRepository } from "@domain/repositories/issue-repository"
import { FrontendDevelopmentService } from "@domain/services/frontend-development"
import { FileSystemPort } from "@domain/services/file-system"

import { FetchProjectsUseCase } from "@application/use-cases/project/fetch-projects"
import { DeployProjectUseCase } from "@application/use-cases/project/deploy-project"
import { FetchProjectUseCase } from "@application/use-cases/project/fetch-project"
import { CreateProjectUseCase } from "@application/use-cases/project/create-project"
import { UpdateProjectDetailsUseCase } from "@application/use-cases/project/update-details"
import { ArchiveProjectUseCase } from "@application/use-cases/project/archive-project"

import { IssueController } from "@infrastructure/http/controllers/issue-controller"
import { ProjectController } from "@infrastructure/http/controllers/project-controller"

import { DynamoDBProjectRepository } from "@infrastructure/repositories/project-repository"
import { DynamoDBIssueRepository } from "@infrastructure/repositories/issue-repository"

import { Workflow } from "@domain/entities/workflow/workflow"
import { PrototypingWorkflow } from "./workflows/prototyping/main"
import { LocalFileSystem } from "./workflows/prototyping/services/local-file-system"
import { YarnPackageManager } from "./workflows/prototyping/services/yarn-package-manager"
import { FrontendDevelopment } from "./workflows/prototyping/services/fronted-development"
import { PackageManager } from "./workflows/prototyping/interfaces/package-manager"
import { CreateIssue } from "@domain/use-cases/issue/create-issue"
import { FetchIssues } from "@domain/use-cases/issue/fetch-issues"
import { UpdateIssueTitle } from "@domain/use-cases/issue/update-title"
import { UpdateIssueDescription } from "@domain/use-cases/issue/update-description"
import { CreateIssueUseCase } from "@application/use-cases/issue/create-issue"
import { FetchIssuesUseCase } from "@application/use-cases/issue/fetch-issues"
import { LeaveCommentUseCase } from "@application/use-cases/issue/leave-comment"
import { UpdateIssueDescriptionUseCase } from "@application/use-cases/issue/update-description"
import { UpdateIssueTitleUseCase } from "@application/use-cases/issue/update-title"
import { LeaveComment } from "@domain/use-cases/issue/leave-comment"
import { WorkflowRunRepository } from "@domain/repositories/workflow-run-repository"
import { OpenSearchWorkflowRunRepository } from "./repositories/workflow-run-repository"
import { FetchWorkflowRunsTimeline } from "@domain/use-cases/workflow-run/fetch-timeline"
import { FetchWorkflowRunsTimelineUseCase } from "@application/use-cases/workflow-run/fetch-timeline"
import { WorkflowRunController } from "./http/controllers/workflow-run-controller"
import { RunPrototypingWorkflowUseCase } from "@application/use-cases/workflow-run/run-prototyping-worfklow"
import { RunPrototypingWorkflow } from "@domain/use-cases/workflow/run-workflow"
import { IssueRefiningWorkflow } from "./workflows/issue-refining/main"
import { ProjectRefiningWorkflow } from "./workflows/project-refining/main"

// Controllers
export const projectController = new ProjectController()
export const issueController = new IssueController()
export const workflowRunController = new WorkflowRunController()

// Services
export const fileSystem: FileSystemPort = new LocalFileSystem()
export const yarnPackageManager: PackageManager = new YarnPackageManager()
export const frontendDevelopmentService: FrontendDevelopmentService = new FrontendDevelopment(yarnPackageManager, fileSystem)


// Repositories
export const projectRepository: ProjectRepository = new DynamoDBProjectRepository()
export const issueRepository: IssueRepository = new DynamoDBIssueRepository()
export const workflowRunRepository: WorkflowRunRepository = new OpenSearchWorkflowRunRepository()

// Workflows
export const prototypingWorkflow: Workflow = new PrototypingWorkflow()
export const issueRefiningWorkflow: Workflow = new IssueRefiningWorkflow()
export const projectRefiningWorkflow: Workflow = new ProjectRefiningWorkflow()
// Use Cases
export const createNewProject: CreateProject = new CreateProjectUseCase(frontendDevelopmentService, projectRepository)
export const fetchProject: FetchProject = new FetchProjectUseCase(projectRepository)
export const fetchProjects: FetchProjects = new FetchProjectsUseCase(projectRepository)
export const deployProject: DeployProject = new DeployProjectUseCase(frontendDevelopmentService, projectRepository)
export const archiveProject: ArchiveProject = new ArchiveProjectUseCase(projectRepository)
export const createIssue: CreateIssue = new CreateIssueUseCase(issueRepository, projectRepository, issueRefiningWorkflow, projectRefiningWorkflow)
export const fetchIssues: FetchIssues = new FetchIssuesUseCase(issueRepository)
export const updateIssueTitle: UpdateIssueTitle = new UpdateIssueTitleUseCase(issueRepository)
export const updateIssueDescription: UpdateIssueDescription = new UpdateIssueDescriptionUseCase(issueRepository)
export const updateProjectDetails: UpdateProjectDetails = new UpdateProjectDetailsUseCase(projectRepository)
export const leaveComment: LeaveComment = new LeaveCommentUseCase(issueRepository)
export const fetchWorkflowRunTimeline: FetchWorkflowRunsTimeline = new FetchWorkflowRunsTimelineUseCase(workflowRunRepository)
export const runPrototypingWorkflow: RunPrototypingWorkflow = new RunPrototypingWorkflowUseCase(issueRepository, prototypingWorkflow)
