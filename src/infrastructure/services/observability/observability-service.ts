import { ObservabilityService } from "@app/ports/services/observability-service"
import { TaskExecution } from "@app/types/task-execution"
import { PlatformSDK } from "@jigjoy-ai/platform-sdk"

export class JigJoyObservabilityService implements ObservabilityService {
    private readonly jigjoyClient: PlatformSDK
	constructor() {
		const JIGJOY_API_ENDPOINT = process.env.JIGJOY_API_ENDPOINT || ""
		this.jigjoyClient = new PlatformSDK(`${JIGJOY_API_ENDPOINT}`)
    }
    
    async taskExecutionStarted(taskTitle: string, projectId: string, taskId: string, accountId: string): Promise<TaskExecution> {
        return await this.jigjoyClient.observability.taskExecutionStarted(taskTitle, projectId, taskId, accountId)
    }
    async taskExecutionSucceeded(taskExecutionId: string): Promise<void> {
        return await this.jigjoyClient.observability.taskExecutionSucceeded(taskExecutionId)
    }
    async taskExecutionFailed(taskExecutionId: string, errorMessage: string): Promise<void> {
        return await this.jigjoyClient.observability.taskExecutionFailed(taskExecutionId, errorMessage)
    }
}