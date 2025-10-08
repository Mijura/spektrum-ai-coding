import { FileArtifacts } from "@jigjoy-io/file-artifacts"

export interface Bundler {
	bundle(projectPath: string): Promise<FileArtifacts>
}