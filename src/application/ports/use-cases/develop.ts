import { Task } from "@jigjoy-io/task-contracts"

export interface DevelopUseCase {
	execute(task: Task, accountId: string): Promise<void>
}
