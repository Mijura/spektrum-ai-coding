// Controllers
import { TicketController } from "@infrastructure/web/controllers/ticket-controller"
import { ProjectController } from "@infrastructure/web/controllers/project-controller"
export const projectController = new ProjectController()
export const ticketController = new TicketController()


// Services
import { FileSystemPort } from "@domain/persistence/file-system"
import { PackageManager } from "@domain/utils/package-manager"
import { FrontendDevelopmentService } from "@application/services/fronted-development"
import { LocalFileSystem } from "@infrastructure/persistence/local-file-system"
import { YarnPackageManager } from "@infrastructure/utils/yarn-package-manager"
export const fileSystem: FileSystemPort = new LocalFileSystem()
export const yarnPackageManager: PackageManager = new YarnPackageManager()
export const frontendDevelopmentService: FrontendDevelopmentService = new FrontendDevelopmentService(yarnPackageManager, fileSystem)


// Repositories
import { DynamoDBProjectRepository } from "@infrastructure/persistence/dynamodb/project-repository"
import { DynamoDBTicketRepository } from "@infrastructure/persistence/dynamodb/ticket-repository"


// Storage
import { ProjectStorage } from "@domain/persistence/project-storage"
import { TicketStorage } from "@domain/persistence/ticket-storage"
export const projectStorage: ProjectStorage = new DynamoDBProjectRepository()
export const ticketStorage: TicketStorage = new DynamoDBTicketRepository()


// Use Cases
import { CreateNewProject } from "@application/use-cases/create-new-project"
import { FetchProject } from "@application/use-cases/fetch-project"
import { DeployProject } from "@application/use-cases/deploy-project"
import { FetchAllProjects } from "@application/use-cases/fetch-all-projects"
import { ArchiveProject } from "@application/use-cases/archive-project"
import { CreateNewTicket } from "@application/use-cases/create-new-ticket"
import { UpdateTicket } from "@application/use-cases/update-ticket"
import { FetchAllTickets } from "@application/use-cases/fetch-all-tickets"
export const createNewProject = new CreateNewProject(frontendDevelopmentService, projectStorage)
export const fetchProject = new FetchProject(projectStorage)
export const fetchAllProjects = new FetchAllProjects(projectStorage)
export const deployProject = new DeployProject(frontendDevelopmentService, projectStorage)
export const archiveProject = new ArchiveProject(projectStorage)
export const createNewTicket = new CreateNewTicket(ticketStorage)
export const updateTicket = new UpdateTicket(ticketStorage)
export const fetchAllTickets = new FetchAllTickets(ticketStorage)


// Workflow Instances
import { LangGraphCodeGeneration } from "@infrastructure/workflows/code-generation/langgraph/langgraph-generate-code"
export const codeGenerationWorkflow = new LangGraphCodeGeneration(frontendDevelopmentService)