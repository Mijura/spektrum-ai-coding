import { FileArtifacts } from "@honeycomb-app/file-artifacts"

export interface Bundler {
	bundle(projectPath: string): Promise<FileArtifacts>
}