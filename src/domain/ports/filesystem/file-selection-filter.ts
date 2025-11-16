import { FileArtifacts } from "@jigjoy-io/project-artifacts-client"

export interface FileSelectionFilter {
    fetch(projectPath: string): Promise<FileArtifacts>
}