import { CodebaseRepositoryPort } from "@app/ports/repositories/codebase-repository"
import { Codebase } from "@domain/codebase"

export class InMemoryCodebaseRepository implements CodebaseRepositoryPort {
	private byProjectId: Map<string, Codebase> = new Map()

	/**
	 * Provide deterministic output for a specific projectId.
	 */
	seed(projectId: string, codebase: Codebase) {
		this.byProjectId.set(projectId, codebase)
	}

	/**
	 * Clear all seeded codebases.
	 */
	clear() {
		this.byProjectId.clear()
	}

	async get(projectId: string): Promise<Codebase> {
		const codebase = this.byProjectId.get(projectId)
		if (!codebase) {
			throw new Error(`Codebase not found for projectId: ${projectId}`)
		}
		return codebase
	}

	async save(codebase: Codebase): Promise<void> {
		this.byProjectId.set(codebase.projectId, codebase)
	}

	/**
	 * Check if a codebase exists for a projectId.
	 */
	has(projectId: string): boolean {
		return this.byProjectId.has(projectId)
	}
}

