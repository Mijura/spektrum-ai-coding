import { ModuleType } from "@domain/module"

export type ModuleRecord = {
	id: string
	repositoryId: string
	type: ModuleType
}
