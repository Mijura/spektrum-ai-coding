import { ProjectDetails } from "@domain/model/project-details"
import { ProjectStorage } from "@domain/persistence/project-storage"
import { FrontendDevelopmentService } from "@application/services/fronted-development"
import { DeployProjectUseCase } from "@domain/use-cases/deploy-project-use-case"

export class DeployProject implements DeployProjectUseCase {
    constructor(
            private readonly frontendDevelopmentService: FrontendDevelopmentService,
            private readonly projectStorage: ProjectStorage) {}

    async execute(projectId: string): Promise<ProjectDetails> {

        const projectDetails = await this.projectStorage.findById(projectId)
        if (!projectDetails) {
            throw new Error("Project not found")
        }
        
        const productionUrl = await this.frontendDevelopmentService.deployProject(projectId, projectDetails.deploymentId)

        console.log(productionUrl)

        projectDetails.deploymentId = productionUrl

        console.log(projectDetails)

        return await this.projectStorage.save(projectDetails)
    }
}
