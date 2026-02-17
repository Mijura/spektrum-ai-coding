import { ProjectPlanningService } from "@app/ports/services/project-planning-service"
import { Contribution, ContributionType } from "@app/types/contribution"
import { ActivityType, Task } from "@jigjoy-ai/task-contracts"
import { SpektrumClient } from "@jigjoy-ai/spektrum-client"

export class JigJoyProjectPlanningService implements ProjectPlanningService {
    private readonly spektrumClient: SpektrumClient
	constructor() {
		const JIGJOY_API_ENDPOINT = process.env.JIGJOY_API_ENDPOINT || ""
		this.spektrumClient = new SpektrumClient(`${JIGJOY_API_ENDPOINT}`, { kind: "internal" , token: process.env.INTERNAL_SERVICE_TOKEN || "" })
    }

	async createProject(owner: string): Promise<{ project: any; entryPoint: any }> {
		return await this.spektrumClient.planning.createNewProject(owner)
	}

	async createTask(task: Task): Promise<Task> {
		return await this.spektrumClient.planning.createTask(task.projectId, task.title, task.description)
	}

	async recordWork(contribution: Contribution): Promise<Task> {
        const type = contribution.type.toString() === ContributionType.STARTED_WORK ? ActivityType.STARTED_WORK : ActivityType.FINISHED_WORK
		return await this.spektrumClient.planning.recordWork(contribution.taskId, contribution.workerId, contribution.message, type)
	}

	async leaveComment(taskId: string, comment: string, authorId: string): Promise<Task> {
		return await this.spektrumClient.planning.leaveComment(taskId, comment, authorId)
	}
}