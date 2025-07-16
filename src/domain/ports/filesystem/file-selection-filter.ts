import { FileArtifacts } from "@domain/value-objects/file-artifacts"

export interface FileSelectionFilter {
    fetch(basePath: string): Promise<FileArtifacts>
}