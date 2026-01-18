import { ProjectPlanningService } from "@app/ports/services/project-planning-service"
import { Contribution, ContributionType } from "@app/types/contribution"
import { ProjectPlanningClient } from "@jigjoy-io/project-planning-client"
import { ActivityType, Task } from "@jigjoy-io/task-contracts"

export class JigJoyProjectPlanningService implements ProjectPlanningService {
    private readonly projectPlanningClient: ProjectPlanningClient

	constructor() {
        const projectPlanningEndpoint = process.env.PROJECT_PLANNING_ENDPOINT as string
        this.projectPlanningClient = new ProjectPlanningClient(projectPlanningEndpoint)
    }

	async createProject(owner: string): Promise<{ project: any; entryPoint: any }> {
		return await this.projectPlanningClient.createNewProject(owner)
	}

	async createTask(task: Task): Promise<Task> {
		return await this.projectPlanningClient.createTask(task.projectId, task.title, task.description)
	}

	async recordWork(contribution: Contribution): Promise<Task> {
        const type = contribution.type.toString() === ContributionType.STARTED_WORK ? ActivityType.STARTED_WORK : ActivityType.FINISHED_WORK
		return await this.projectPlanningClient.recordWork(contribution.taskId, contribution.workerId, contribution.message, type)
	}

	async leaveComment(taskId: string, comment: string, authorId: string): Promise<Task> {
		return await this.projectPlanningClient.leaveComment(taskId, comment, authorId)
	}
}