import { FileArtifacts } from "@application/value-objects/file-artifacts"

export interface BundlerServicePort {
	bundle(projectPath: string): Promise<FileArtifacts>
}
