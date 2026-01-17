import { TaskExecution } from "@app/types/task-execution"

export interface ObservabilityService {
	taskExecutionStarted(taskTitle: string, taskProjectId: string, taskExecutionId: string, accountId: string): Promise<TaskExecution>
	taskExecutionSucceeded(taskExecutionId: string): Promise<void>
	taskExecutionFailed(taskExecutionId: string, errorMessage: string): Promise<void>
}