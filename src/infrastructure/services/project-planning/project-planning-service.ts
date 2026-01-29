import { ProjectPlanningService } from "@app/ports/services/project-planning-service"
import { Contribution, ContributionType } from "@app/types/contribution"
import { ActivityType, Task } from "@jigjoy-io/task-contracts"
import { PlatformSDK } from "@jigjoy-io/platform-sdk"

export class JigJoyProjectPlanningService implements ProjectPlanningService {
    private readonly jigjoyClient: PlatformSDK
	constructor() {
		const API_GATEWAY = process.env.API_GATEWAY || ""
		this.jigjoyClient = new PlatformSDK(`${API_GATEWAY}`)
    }

	async createProject(owner: string): Promise<{ project: any; entryPoint: any }> {
		return await this.jigjoyClient.planning.createNewProject(owner)
	}

	async createTask(task: Task): Promise<Task> {
		return await this.jigjoyClient.planning.createTask(task.projectId, task.title, task.description)
	}

	async recordWork(contribution: Contribution): Promise<Task> {
        const type = contribution.type.toString() === ContributionType.STARTED_WORK ? ActivityType.STARTED_WORK : ActivityType.FINISHED_WORK
		return await this.jigjoyClient.planning.recordWork(contribution.taskId, contribution.workerId, contribution.message, type)
	}

	async leaveComment(taskId: string, comment: string, authorId: string): Promise<Task> {
		return await this.jigjoyClient.planning.leaveComment(taskId, comment, authorId)
	}
}