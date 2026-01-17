import { ObservabilityService } from "@app/ports/services/observability-service"
import { TaskExecution } from "@app/types/task-execution"
import { ObservabilityClient } from "@jigjoy-io/observability-client"

export class JigJoyObservabilityService implements ObservabilityService {
	private readonly observabilityClient: ObservabilityClient
	constructor() {
		const observabilityEndpoint = process.env.OBSERVABILITY_ENDPOINT as string
		this.observabilityClient = new ObservabilityClient(observabilityEndpoint)
	}
    async taskExecutionStarted(taskTitle: string, taskProjectId: string, taskExecutionId: string, accountId: string): Promise<TaskExecution> {
        return await this.observabilityClient.taskExecutionStarted(taskTitle, taskProjectId, taskExecutionId, accountId)
    }
    async taskExecutionSucceeded(taskExecutionId: string): Promise<void> {
        return await this.observabilityClient.taskExecutionSucceeded(taskExecutionId)
    }
    async taskExecutionFailed(taskExecutionId: string, errorMessage: string): Promise<void> {
        return await this.observabilityClient.taskExecutionFailed(taskExecutionId, errorMessage)
    }
}