import { BundlerPort } from "@app/ports/services/bundler"
import { FileArtifacts } from "@domain/file-artifacts"

export class InMemoryBundlerPort implements BundlerPort {
	private byProjectPath: Map<string, FileArtifacts> = new Map()

	private defaultFileArtifacts: FileArtifacts = new FileArtifacts()

	/**
	 * Provide deterministic output for a specific projectPath.
	 */
	seed(projectPath: string, fileArtifacts: FileArtifacts) {
		this.byProjectPath.set(projectPath, fileArtifacts)
	}

	/**
	 * Provide fallback output when no project-specific value is seeded.
	 */
	setDefault(fileArtifacts: FileArtifacts) {
		this.defaultFileArtifacts = fileArtifacts
	}

	async bundle(projectPath: string): Promise<FileArtifacts> {
		// Check for exact match first
		if (this.byProjectPath.has(projectPath)) {
			return this.byProjectPath.get(projectPath)!
		}
		// Check if any seeded path is a prefix of the project path
		for (const [seededPath, artifacts] of this.byProjectPath.entries()) {
			if (projectPath.startsWith(seededPath)) {
				return artifacts
			}
		}
		return this.defaultFileArtifacts
	}
}
