export interface RunWorkflow {
	execute(taskId: string, workflowId: string, accountId: string): Promise<void>
}
