import { FileArtifacts } from "@jigjoy-io/project-artifacts-client"

export interface Template {
    fetchPrebuiltFiles(): Promise<FileArtifacts>
    fetchSourceCode(): Promise<FileArtifacts>
}