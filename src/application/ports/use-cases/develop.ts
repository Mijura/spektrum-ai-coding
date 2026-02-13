import { Task } from "@jigjoy-ai/task-contracts"

export interface DevelopUseCase {
	execute(task: Task, accountId: string): Promise<number>
}
