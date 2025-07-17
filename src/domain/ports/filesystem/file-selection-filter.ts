import { FileArtifacts } from "@domain/value-objects/file-artifacts"

export interface FileSelectionFilter {
    fetch(projectPath: string): Promise<FileArtifacts>
}