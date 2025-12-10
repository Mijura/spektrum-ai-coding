import { FileArtifacts } from "@domain/value-objects/file-artifacts"

export interface Bundler {
	bundle(projectPath: string): Promise<FileArtifacts>
}