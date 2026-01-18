import { TemplateRepositoryPort } from "@app/ports/repositories/template-repository"
import { FileArtifacts } from "@domain/file-artifacts"

export class InMemoryTemplateRepository implements TemplateRepositoryPort {
	private defaultPrebuiltFiles: FileArtifacts = new FileArtifacts()
	private defaultSourceCode: FileArtifacts = new FileArtifacts()

	/**
	 * Provide fallback output for prebuilt files.
	 */
	setDefaultPrebuiltFiles(fileArtifacts: FileArtifacts) {
		this.defaultPrebuiltFiles = fileArtifacts
	}

	/**
	 * Provide fallback output for source code.
	 */
	setDefaultSourceCode(fileArtifacts: FileArtifacts) {
		this.defaultSourceCode = fileArtifacts
	}

	async fetchPrebuiltFiles(): Promise<FileArtifacts> {
		return this.defaultPrebuiltFiles
	}

	async fetchSourceCode(): Promise<FileArtifacts> {
		return this.defaultSourceCode
	}
}
