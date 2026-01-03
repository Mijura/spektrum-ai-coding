import { Task } from "@jigjoy-io/task-contracts"

export interface Develop {
	execute(task: Task): Promise<void>
}
