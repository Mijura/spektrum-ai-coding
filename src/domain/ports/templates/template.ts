import { FileArtifacts } from "@jigjoy-io/file-artifacts"

export interface Template {
    fetchPrebuiltFiles(): Promise<FileArtifacts>
    fetchSourceCode(): Promise<FileArtifacts>
}