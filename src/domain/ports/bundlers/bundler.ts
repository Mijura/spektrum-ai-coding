import { FileArtifacts } from "@jigjoy-io/project-artifacts-client"

export interface Bundler {
	bundle(projectPath: string): Promise<FileArtifacts>
}