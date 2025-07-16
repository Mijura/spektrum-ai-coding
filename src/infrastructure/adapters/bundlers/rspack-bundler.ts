import { Bundler } from "@domain/ports/bundlers/bundler"
import { BuildArtifact } from "@domain/value-objects/file-artifacts"
import { PackageManager } from "@infrastructure/ports/package-manager"
import path from "path"

export default class RspackBundler implements Bundler {

	constructor(private readonly yarnPackageManager: PackageManager) {}

	async bundle(projectId: string, projectPath: string, preBuilt: boolean): Promise<BuildArtifact> {
		const outDir = path.join(projectPath, "dist")
		if (!preBuilt) {
			await this.yarnPackageManager.install(projectPath)
			await this.yarnPackageManager.build(projectPath)
		}
		return new BuildArtifact(projectId, outDir)
	}
}