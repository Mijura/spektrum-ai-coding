import { Codebase } from "@domain/entities/codebase"
import { CodebaseRecord } from "@infrastructure/records/codebase"
import { ModuleMapper } from "./module-mapper"

export class CodebaseMapper {
    
	static toRecord(codebase: Codebase): CodebaseRecord {
		return {
			projectId: codebase.projectId,
			modules: codebase.modules.map((module) => ModuleMapper.toRecord(module)),
		}
	}

	static toDomain(record: CodebaseRecord): Codebase {
		return Codebase.rehydrate({
			projectId: record.projectId,
			modules: record.modules,
		})
	}

	static toDomains(records: CodebaseRecord[]): Codebase[] {
		return records.map((record) => this.toDomain(record))
	}
}

