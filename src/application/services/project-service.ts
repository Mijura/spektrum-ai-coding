import { Task } from "@domain/entities/task"
import { Contributor } from "@domain/ports/contirbutor"
import { ProjectService } from "@domain/ports/project-service"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { ProjectDetails } from "@domain/types/project-details"

export class DefaultProjectService implements ProjectService {
    constructor(
        private readonly projectRefiner: Contributor,   
        private readonly projectRepository: ProjectRepository
    ) {}

    async updateDetailsWithAI(task: Task) {
        const project = await this.projectRepository.get(task.projectId)
        if (!project) {
            throw new Error("Project not found")
        }

        if (!project.detailsUpdated) {
            const projectDetails: ProjectDetails = await this.projectRefiner.execute(task)
            project.updateDetails(projectDetails.name, projectDetails.description)
            await this.projectRepository.save(project)
        }
    }
}