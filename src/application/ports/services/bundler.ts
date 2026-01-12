import { FileArtifacts } from "@application/value-objects/file-artifacts"

export interface Bundler {
	bundle(projectPath: string): Promise<FileArtifacts>
}
