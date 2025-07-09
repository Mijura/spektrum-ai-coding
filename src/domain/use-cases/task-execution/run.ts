export interface RunTaskExecution {
	execute(taskId: string, workflowId: string, accountId: string): Promise<void>
}
