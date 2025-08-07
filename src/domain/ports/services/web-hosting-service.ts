import { FileArtifacts } from "@domain/value-objects/file-artifacts"

export interface WebHostingService {
    deployPrebuiltCode(projectId: string, buildArtifact: FileArtifacts): Promise<string>
}