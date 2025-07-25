export interface RunTaskExecution {
	execute(taskId: string, accountId: string): Promise<void>
}
