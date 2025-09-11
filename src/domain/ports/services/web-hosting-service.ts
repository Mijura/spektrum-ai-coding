import { FileArtifacts } from "@honeycomb-app/file-artifacts"


export interface WebHostingService {
    deployPrebuiltCode(projectId: string, buildArtifact: FileArtifacts): Promise<string>
}