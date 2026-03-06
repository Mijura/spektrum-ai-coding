import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"
import { Task } from "@jigjoy-ai/task-contracts"

export type DevelopRequest = {
	task: Task
}

export type DevelopUseCase = AuthenticatedUseCase<UserData, DevelopRequest, number>