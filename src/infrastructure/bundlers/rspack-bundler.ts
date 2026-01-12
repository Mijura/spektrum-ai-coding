import { Bundler } from "@application/ports/services/bundler"
import { PackageManager } from "@infrastructure/package-managers/package-manager"
import { FileSelectionFilter } from "@infrastructure/filesystem/file-selection-filter"
import { FileArtifacts } from "@application/value-objects/file-artifacts"

export default class RspackBundler implements Bundler {
	constructor(
		private readonly yarnPackageManager: PackageManager,
		private readonly distFolderFilter: FileSelectionFilter,
	) {}

	async bundle(projectPath: string): Promise<FileArtifacts> {
		await this.yarnPackageManager.install(projectPath)
		await this.yarnPackageManager.build(projectPath)
		return this.distFolderFilter.fetch(projectPath)
	}
}
