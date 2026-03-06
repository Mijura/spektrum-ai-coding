import { FileArtifacts } from "@domain/file-artifacts"

export interface TemplateRepositoryPort {
	fetchPrebuiltFiles(): Promise<FileArtifacts>
	fetchSourceCode(): Promise<FileArtifacts>
}
