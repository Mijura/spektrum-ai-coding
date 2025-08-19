export interface Develop {
	execute(taskId: string, accountId: string): Promise<void>
}
