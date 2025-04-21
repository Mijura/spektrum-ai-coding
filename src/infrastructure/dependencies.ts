import { CreateProject } from "@domain/use-cases/project/create-project"
import { FetchProject } from "@domain/use-cases/project/fetch-project"
import { FetchProjects } from "@domain/use-cases/project/fetch-projects"
import { ArchiveProject } from "@domain/use-cases/project/archive-project"
import { DeployProject } from "@domain/use-cases/project/deploy-project"
import { CreateTicket } from "@domain/use-cases/ticket/create-ticket"
import { FetchTickets } from "@domain/use-cases/ticket/fetch-tickets"
import { UpdateTicketTitle } from "@domain/use-cases/ticket/update-title"
import { UpdateTicketDescription } from "@domain/use-cases/ticket/update-description"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { TicketRepository } from "@domain/repositories/ticket-repository"



import { FrontendDevelopmentService } from "@domain/services/frontend-development"
import { FileSystemPort } from "@domain/services/file-system"
import { PackageManager } from "@domain/utils/package-manager"

import { FetchProjectsUseCase } from "@application/use-cases/project/fetch-projects"
import { DeployProjectUseCase } from "@application/use-cases/project/deploy-project"
import { FetchProjectUseCase } from "@application/use-cases/project/fetch-project"
import { CreateProjectUseCase } from "@application/use-cases/project/create-project"
import { ArchiveProjectUseCase } from "@application/use-cases/project/archive-project"
import { CreateTicketUseCase } from "@application/use-cases/ticket/create-ticket"
import { UpdateTicketTitleUseCase } from "@application/use-cases/ticket/update-title"
import { UpdateTicketDescriptionUseCase } from "@application/use-cases/ticket/update-description"
import { FetchTicketsUseCase } from "@application/use-cases/ticket/fetch-tickets"

import { TicketController } from "@infrastructure/http/controllers/ticket-controller"
import { ProjectController } from "@infrastructure/http/controllers/project-controller"

import { DynamoDBProjectRepository } from "@infrastructure/repositories/project-repository"
import { DynamoDBTicketRepository } from "@infrastructure/repositories/ticket-repository"

import { LangGraphCodeGeneration } from "@infrastructure/workflows/langchain-code-generation/langgraph-generate-code"
import { FrontendDevelopment } from "@infrastructure/workflows/services/fronted-development"
import { LocalFileSystem } from "@infrastructure/workflows/services/local-file-system"
import { YarnPackageManager } from "@infrastructure/workflows/services/yarn-package-manager"




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


// Workflows
export const codeGenerationWorkflow = new LangGraphCodeGeneration(frontendDevelopmentService)