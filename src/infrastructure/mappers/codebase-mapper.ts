import { Codebase } from "@domain/entities/codebase"
import { CodebaseRecord } from "@infrastructure/records/codebase"

export class CodebaseMapper {
    
	static toRecord(codebase: Codebase): CodebaseRecord {
		return {
			projectId: codebase.projectId,
			modules: codebase.modules,
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

