import { FileArtifacts } from "@application/value-objects/file-artifacts"

export interface TemplateService {
	fetchPrebuiltFiles(): Promise<FileArtifacts>
	fetchSourceCode(): Promise<FileArtifacts>
}
