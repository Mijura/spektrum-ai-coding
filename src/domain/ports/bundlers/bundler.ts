import { BuildArtifact } from "@domain/value-objects/file-artifacts"

export interface Bundler {
	bundle(projectId: string,projectPath: string, preBuilt?: boolean): Promise<BuildArtifact>
}