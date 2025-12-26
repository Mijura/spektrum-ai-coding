
import { Module } from "@domain/entities/module"
import { ModuleRecord } from "@infrastructure/records/module"

export class ModuleMapper {
	static toRecord(module: Module): ModuleRecord {
		return {
			id: module.id,
			repositoryId: module.repositoryId,
			moduleType: module.moduleType
		}
	}
}