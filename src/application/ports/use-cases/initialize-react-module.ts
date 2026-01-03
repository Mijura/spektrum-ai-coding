import { Module } from "@domain/entities/module"

export interface InitializeReactModule {
	execute(projectId: string): Promise<Module>
}