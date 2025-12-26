import { ModuleType } from "@domain/entities/module"

export type ModuleRecord = {
	id: string,
	repositoryId: string,
	moduleType: ModuleType
}