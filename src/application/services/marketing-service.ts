import { Task } from "@domain/entities/task"
import { Contributor } from "@domain/ports/ai/contributor"
import { ProjectRepository } from "@domain/ports/repositories/project-repository"
import { MarketingService } from "@domain/ports/services/marketing-service"
import { ProjectDetails } from "@domain/value-objects/project-details"

export class DefaultMarketingService implements MarketingService {

    constructor(
        private readonly marketeer: Contributor,   
        private readonly projectRepository: ProjectRepository
    ) {}

    async updateProjectDetails(task: Task) {
        const project = await this.projectRepository.get(task.projectId)
        if (!project) {
            throw new Error("Project not found")
        }

        if (!project.detailsUpdated) {
            const projectDetails: ProjectDetails = await this.marketeer.execute(task)
            project.setDetails(projectDetails.name, projectDetails.description)
            await this.projectRepository.save(project)
        }
    }
}