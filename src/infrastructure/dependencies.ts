import { CreateProject } from "@domain/use-cases/project/create-project"
import { UpdateProjectDetails } from "@domain/use-cases/project/update-details"
import { FetchProject } from "@domain/use-cases/project/fetch-project"
import { FetchProjects } from "@domain/use-cases/project/fetch-projects"
import { ArchiveProject } from "@domain/use-cases/project/archive-project"
import { DeployProject } from "@domain/use-cases/project/deploy-project"
import { CreateTicket } from "@domain/use-cases/ticket/create-ticket"
import { FetchTickets } from "@domain/use-cases/ticket/fetch-tickets"
import { UpdateTicketTitle } from "@domain/use-cases/ticket/update-title"
import { UpdateTicketDescription } from "@domain/use-cases/ticket/update-description"
import { LeaveComment } from "@domain/use-cases/ticket/leave-comment"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { TicketRepository } from "@domain/repositories/ticket-repository"
import { FrontendDevelopmentService } from "@domain/services/frontend-development"
import { FileSystemPort } from "@domain/services/file-system"

import { FetchProjectsUseCase } from "@application/use-cases/project/fetch-projects"
import { DeployProjectUseCase } from "@application/use-cases/project/deploy-project"
import { FetchProjectUseCase } from "@application/use-cases/project/fetch-project"
import { CreateProjectUseCase } from "@application/use-cases/project/create-project"
import { UpdateProjectDetailsUseCase } from "@application/use-cases/project/update-details"
import { ArchiveProjectUseCase } from "@application/use-cases/project/archive-project"
import { CreateTicketUseCase } from "@application/use-cases/ticket/create-ticket"
import { UpdateTicketTitleUseCase } from "@application/use-cases/ticket/update-title"
import { UpdateTicketDescriptionUseCase } from "@application/use-cases/ticket/update-description"
import { FetchTicketsUseCase } from "@application/use-cases/ticket/fetch-tickets"
import { LeaveCommentUseCase } from "@application/use-cases/ticket/leave-comment"

import { TicketController } from "@infrastructure/http/controllers/ticket-controller"
import { ProjectController } from "@infrastructure/http/controllers/project-controller"

import { DynamoDBProjectRepository } from "@infrastructure/repositories/project-repository"
import { DynamoDBTicketRepository } from "@infrastructure/repositories/ticket-repository"

import { Workflow } from "@domain/entities/workflow"
import { PrototypingWorkflow } from "./workflows/prototyping"
import { LocalFileSystem } from "./workflows/prototyping/services/local-file-system"
import { YarnPackageManager } from "./workflows/prototyping/services/yarn-package-manager"
import { FrontendDevelopment } from "./workflows/prototyping/services/fronted-development"
import { PackageManager } from "./workflows/prototyping/interfaces/package-manager"




// Controllers
export const projectController = new ProjectController()
export const ticketController = new TicketController()


// Services
export const fileSystem: FileSystemPort = new LocalFileSystem()
export const yarnPackageManager: PackageManager = new YarnPackageManager()
export const frontendDevelopmentService: FrontendDevelopmentService = new FrontendDevelopment(yarnPackageManager, fileSystem)


// Repositories
export const projectRepository: ProjectRepository = new DynamoDBProjectRepository()
export const ticketRepository: TicketRepository = new DynamoDBTicketRepository()


// Use Cases
export const createNewProject: CreateProject = new CreateProjectUseCase(frontendDevelopmentService, projectRepository)
export const fetchProject: FetchProject = new FetchProjectUseCase(projectRepository)
export const fetchProjects: FetchProjects = new FetchProjectsUseCase(projectRepository)
export const deployProject: DeployProject = new DeployProjectUseCase(frontendDevelopmentService, projectRepository)
export const archiveProject: ArchiveProject = new ArchiveProjectUseCase(projectRepository)
export const createTicket: CreateTicket = new CreateTicketUseCase(ticketRepository)
export const fetchTickets: FetchTickets = new FetchTicketsUseCase(ticketRepository)
export const updateTicketTitle: UpdateTicketTitle = new UpdateTicketTitleUseCase(ticketRepository)
export const updateTicketDescription: UpdateTicketDescription = new UpdateTicketDescriptionUseCase(ticketRepository)
export const updateProjectDetails: UpdateProjectDetails = new UpdateProjectDetailsUseCase(projectRepository)
export const leaveComment: LeaveComment = new LeaveCommentUseCase(ticketRepository)

// Workflows
export const prototypingWorkflow: Workflow = new PrototypingWorkflow()