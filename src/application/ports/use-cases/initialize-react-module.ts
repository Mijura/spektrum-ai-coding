import { Module } from "@domain/module"

export interface InitializeReactModule {
	execute(projectId: string): Promise<Module>
}