import { FileArtifacts } from "@application/value-objects/file-artifacts"

export interface FileSelectionFilter {
	fetch(projectPath: string): Promise<FileArtifacts>
}
