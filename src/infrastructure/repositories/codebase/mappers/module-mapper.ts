import { ModuleRecord } from "@infra/repositories/codebase/records/module"
import { Module } from "@domain/module"

export class ModuleMapper {
	static toRecord(module: Module): ModuleRecord {
		return {
			id: module.id,
			repositoryId: module.repositoryId,
			type: module.type,
		}
	}
}
