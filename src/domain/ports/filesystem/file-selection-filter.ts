import { FileArtifacts } from "@honeycomb-app/file-artifacts"

export interface FileSelectionFilter {
    fetch(projectPath: string): Promise<FileArtifacts>
}