import { Codebase } from "@domain/codebase"

export interface CodebaseRepositoryPort {
	get(projectId: string): Promise<Codebase>
	save(codebase: Codebase): Promise<void>
}
