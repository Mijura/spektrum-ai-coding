export interface RunPrototypingWorkflow {
	run(taskId: string, accountId: string): Promise<void>
}
