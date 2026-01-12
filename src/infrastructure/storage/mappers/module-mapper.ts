import { Module } from "@domain/module"
import { ModuleRecord } from "@infrastructure/storage/records/module"

export class ModuleMapper {
	static toRecord(module: Module): ModuleRecord {
		return {
			id: module.id,
			repositoryId: module.repositoryId,
			type: module.type,
		}
	}
}
