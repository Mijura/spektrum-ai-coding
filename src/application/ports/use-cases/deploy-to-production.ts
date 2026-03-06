import { EntryPoint } from "@app/types/entry-point"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type DeployToProductionRequest = {
	projectId: string
}

export type DeployToProductionUseCase = AuthenticatedUseCase<UserData, DeployToProductionRequest, EntryPoint>