import { ObservabilityService } from "@app/ports/services/observability-service"
import { TaskExecution } from "@app/types/task-execution"
import { SpektrumClient } from "@jigjoy-ai/spektrum-client"

export class JigJoyObservabilityService implements ObservabilityService {
    private readonly spektrumClient: SpektrumClient
	constructor() {
		const JIGJOY_API_ENDPOINT = process.env.JIGJOY_API_ENDPOINT || ""
		this.spektrumClient = new SpektrumClient(`${JIGJOY_API_ENDPOINT}`, { kind: "internal" , token: process.env.INTERNAL_SERVICE_TOKEN || "" })
    }
    
    async taskExecutionStarted(taskTitle: string, projectId: string, taskId: string, accountId: string): Promise<TaskExecution> {
        return await this.spektrumClient.observability.taskExecutionStarted(taskTitle, projectId, taskId, accountId)
    }
    async taskExecutionSucceeded(taskExecutionId: string): Promise<void> {
        return await this.spektrumClient.observability.taskExecutionSucceeded(taskExecutionId)
    }
    async taskExecutionFailed(taskExecutionId: string, errorMessage: string): Promise<void> {
        return await this.spektrumClient.observability.taskExecutionFailed(taskExecutionId, errorMessage)
    }
}