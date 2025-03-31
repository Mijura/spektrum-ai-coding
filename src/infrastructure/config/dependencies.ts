import { LocalFileSystem } from "@infrastructure/persistence/local-file-system"
import { YarnPackageManager } from "@infrastructure/utils/yarn-package-manager"
import { DynamoDBProjectRepository } from "@infrastructure/persistence/dynamodb/project-repository"
import { LangGraphCodeGeneration } from "@infrastructure/workflows/code-generation/langgraph/langgraph-generate-code"

// Use Cases
import { CreateNewProject } from "@application/use-cases/create-new-project"
import { FetchProject } from "@application/use-cases/fetch-project"

// Ports
import { FileSystemPort } from "@domain/persistence/file-system"
import { PackageManager } from "@domain/utils/package-manager"
import { ProjectStorage } from "@domain/persistence/project-storage"
import { CodeGenerationWorkflow } from "@domain/workflows/code-generation"
import { ProjectController } from "@infrastructure/web/controllers/project-controller"
import { FrontendDevelopmentService } from "@application/services/fronted-development"
import { DevelopUserRequest } from "@application/use-cases/develop-user-request"
import { DeployProject } from "@application/use-cases/deploy-project"
import { FetchAllProjects } from "@application/use-cases/fetch-all-projects"

// Ticket
import { TicketController } from "@infrastructure/web/controllers/ticket-controller"
import { TicketStorage } from "@domain/persistence/ticket-storage"
import { DynamoDBTicketRepository } from "@infrastructure/persistence/dynamodb/ticket-repository"
import { CreateNewTicket } from "@application/use-cases/create-new-ticket"
import { FetchAllTickets } from "@application/use-cases/fetch-all-tickets"

// Concrete implementations
export const fileSystem: FileSystemPort = new LocalFileSystem()
export const yarnPackageManager: PackageManager = new YarnPackageManager()
export const projectStorage: ProjectStorage = new DynamoDBProjectRepository()
export const ticketStorage: TicketStorage = new DynamoDBTicketRepository()
export const frontendDevelopmentService: FrontendDevelopmentService = new FrontendDevelopmentService(yarnPackageManager, fileSystem)
export const codeGenerationWorkflow: CodeGenerationWorkflow = new LangGraphCodeGeneration(frontendDevelopmentService)


export const projectController = new ProjectController()
export const ticketController = new TicketController()
// Use Case Instances
export const createNewProject = new CreateNewProject(frontendDevelopmentService, projectStorage)
export const fetchProject = new FetchProject(projectStorage)
export const fetchAllProjects = new FetchAllProjects(projectStorage)
export const deployProject = new DeployProject(frontendDevelopmentService, projectStorage)
export const developUserRequest = new DevelopUserRequest(projectStorage, codeGenerationWorkflow)

export const createNewTicket = new CreateNewTicket(ticketStorage)
export const fetchAllTickets = new FetchAllTickets(ticketStorage)