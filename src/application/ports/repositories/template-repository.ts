import { FileArtifacts } from "@application/value-objects/file-artifacts"

export interface TemplateRepositoryPort {
	fetchPrebuiltFiles(): Promise<FileArtifacts>
	fetchSourceCode(): Promise<FileArtifacts>
}
