import { FileArtifacts } from "@domain/value-objects/file-artifacts"

export interface WebHostingService {
    deployPrebuiltCode(buildArtifact: FileArtifacts): Promise<string>
}