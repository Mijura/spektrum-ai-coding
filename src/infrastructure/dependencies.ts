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

import { Workflow } from "@domain/entities/workflow"
import { PrototypingWorkflow } from "./workflows/prototyping"
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
import { ActivityRepository } from "@domain/repositories/activity-repository"
import { OpenSearchActivityRepository } from "./repositories/activity-repository"
import { FetchIssueActivities } from "@domain/use-cases/activities/fetch-issue-activities"
import { FetchIssueActivitiesUseCase } from "@application/use-cases/activities/fetch-issue-activities"
import { FetchWorkflowRunTimeline } from "@domain/use-cases/activities/fetch-worfklow-run-timeline"
import { FetchWorkflowRunTimelineUseCase } from "@application/use-cases/activities/fetch-workflow-run-timeline"
import { ActivityController } from "./http/controllers/activity-controller"

// Controllers
export const projectController = new ProjectController()
export const issueController = new IssueController()
export const activityController = new ActivityController()

// Services
export const fileSystem: FileSystemPort = new LocalFileSystem()
export const yarnPackageManager: PackageManager = new YarnPackageManager()
export const frontendDevelopmentService: FrontendDevelopmentService = new FrontendDevelopment(yarnPackageManager, fileSystem)


// Repositories
export const projectRepository: ProjectRepository = new DynamoDBProjectRepository()
export const issueRepository: IssueRepository = new DynamoDBIssueRepository()
export const activityRepository: ActivityRepository = new OpenSearchActivityRepository()

// Use Cases
export const createNewProject: CreateProject = new CreateProjectUseCase(frontendDevelopmentService, projectRepository)
export const fetchProject: FetchProject = new FetchProjectUseCase(projectRepository)
export const fetchProjects: FetchProjects = new FetchProjectsUseCase(projectRepository)
export const deployProject: DeployProject = new DeployProjectUseCase(frontendDevelopmentService, projectRepository)
export const archiveProject: ArchiveProject = new ArchiveProjectUseCase(projectRepository)
export const createIssue: CreateIssue = new CreateIssueUseCase(issueRepository, activityRepository)
export const fetchIssues: FetchIssues = new FetchIssuesUseCase(issueRepository)
export const updateIssueTitle: UpdateIssueTitle = new UpdateIssueTitleUseCase(issueRepository)
export const updateIssueDescription: UpdateIssueDescription = new UpdateIssueDescriptionUseCase(issueRepository)
export const updateProjectDetails: UpdateProjectDetails = new UpdateProjectDetailsUseCase(projectRepository)
export const leaveComment: LeaveComment = new LeaveCommentUseCase(issueRepository)
export const fetchIssueActivities: FetchIssueActivities = new FetchIssueActivitiesUseCase(activityRepository)
export const fetchWorkflowRunTimeline: FetchWorkflowRunTimeline = new FetchWorkflowRunTimelineUseCase(activityRepository)

// Workflows
export const prototypingWorkflow: Workflow = new PrototypingWorkflow()