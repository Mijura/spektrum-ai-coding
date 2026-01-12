import { Module } from "@domain/module"

export interface InitializeReactModuleUseCase {
	execute(projectId: string): Promise<Module>
}
