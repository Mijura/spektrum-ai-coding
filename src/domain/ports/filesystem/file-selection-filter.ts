import { FileArtifacts } from "@jigjoy-io/file-artifacts"

export interface FileSelectionFilter {
    fetch(projectPath: string): Promise<FileArtifacts>
}