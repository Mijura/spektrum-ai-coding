import { Task } from "@domain/entities/task"
import { ProjectService } from "@domain/ports/project-service"
import { WorkflowRunner } from "@domain/ports/workflow-runner"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { ProjectDetails } from "@domain/types/project-details"

export class DefaultProjectService implements ProjectService {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly projectRefiningWorkflow: WorkflowRunner
    ) {}

    async updateProjectDetails(task: Task) {
        const project = await this.projectRepository.get(task.projectId)
        if (!project) {
            throw new Error("Project not found")
        }

        if (!project.detailsUpdated) {
            const accountId = "User"
            const projectDetails: ProjectDetails = await this.projectRefiningWorkflow.run(task, accountId)
            project.updateDetails(projectDetails.name, projectDetails.description)
            await this.projectRepository.save(project)
        }
    }
}