import { Task } from "@jigjoy-io/task-contracts"

export interface Develop {
	execute(task: Task, accountId: string): Promise<void>
}
