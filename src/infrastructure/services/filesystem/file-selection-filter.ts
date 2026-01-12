import { FileArtifacts } from "@domain/file-artifacts"

export interface FileSelectionFilter {
	fetch(projectPath: string): Promise<FileArtifacts>
}
