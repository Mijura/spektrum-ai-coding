import { FileArtifacts } from "@domain/file-artifacts"

export interface BundlerServicePort {
	bundle(projectPath: string): Promise<FileArtifacts>
}
