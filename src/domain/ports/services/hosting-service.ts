import { FileArtifacts } from "@domain/value-objects/file-artifacts"

export interface HostingService {
    deployPrebuiltCode(buildArtifact: FileArtifacts): Promise<string>
}