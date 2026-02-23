import { TaskExecution } from "@app/types/task-execution"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export interface ObservabilityService {
	taskExecutionStarted(taskTitle: string, taskProjectId: string, taskExecutionId: string, auth: Auth<UserData>): Promise<TaskExecution>
	taskExecutionSucceeded(taskExecutionId: string, auth: Auth<UserData>): Promise<void>
	taskExecutionFailed(taskExecutionId: string, errorMessage: string, auth: Auth<UserData>): Promise<void>
}