import { ObservabilityService } from "@app/ports/services/observability-service"
import { TaskExecution } from "@app/types/task-execution"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"
import { SpektrumClient } from "@jigjoy-ai/spektrum-client"

export class JigJoyObservabilityService implements ObservabilityService {
    private readonly spektrumClient: SpektrumClient
	constructor() {
		const JIGJOY_API_ENDPOINT = process.env.JIGJOY_API_ENDPOINT || ""
		this.spektrumClient = new SpektrumClient(`${JIGJOY_API_ENDPOINT}`, { kind: "internal" , token: process.env.INTERNAL_SERVICE_TOKEN || "" })
    }
    
    async taskExecutionStarted(taskTitle: string, projectId: string, taskId: string, auth: Auth<UserData>): Promise<TaskExecution> {
        return await this.spektrumClient.observability.taskExecutionStarted(taskTitle, projectId, taskId, auth)
    }
    async taskExecutionSucceeded(taskExecutionId: string, auth: Auth<UserData>): Promise<void> {
        return await this.spektrumClient.observability.taskExecutionSucceeded(taskExecutionId, auth)
    }
    async taskExecutionFailed(taskExecutionId: string, errorMessage: string, auth: Auth<UserData>): Promise<void> {
        return await this.spektrumClient.observability.taskExecutionFailed(taskExecutionId, errorMessage, auth)
    }
}