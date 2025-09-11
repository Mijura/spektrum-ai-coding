import { FileArtifacts } from "@honeycomb-app/file-artifacts"

export interface Template {
    fetchPrebuiltFiles(): Promise<FileArtifacts>
    fetchSourceCode(): Promise<FileArtifacts>
}