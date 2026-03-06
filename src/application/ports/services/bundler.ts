import { FileArtifacts } from "@domain/file-artifacts"

export interface BundlerPort {
	bundle(projectPath: string): Promise<FileArtifacts>
}
