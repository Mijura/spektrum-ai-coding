export interface RunPrototypingWorkflow {
	run(issueId: string, accountId: string): Promise<void>
}
