import { FileArtifacts } from "@domain/value-objects/file-artifacts"

export interface Template {
    fetchPrebuiltFiles(): Promise<FileArtifacts>
    fetchSourceCode(): Promise<FileArtifacts>
}