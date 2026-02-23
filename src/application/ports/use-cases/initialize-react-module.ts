import { Module } from "@domain/module"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type InitializeReactModuleRequest = {
	projectId: string
}

export type InitializeReactModuleUseCase = AuthenticatedUseCase<UserData, InitializeReactModuleRequest, Module>