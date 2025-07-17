import { Bundler } from "@domain/ports/bundlers/bundler"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { PackageManager } from "@infrastructure/ports/package-manager"
import { FileSelectionFilter } from "@domain/ports/filesystem/file-selection-filter"

export default class RspackBundler implements Bundler {

	constructor(
		private readonly yarnPackageManager: PackageManager,
		private readonly distFolderFilter: FileSelectionFilter
	) {}

	async bundle(projectPath: string): Promise<FileArtifacts> {
		
		await this.yarnPackageManager.install(projectPath)
		await this.yarnPackageManager.build(projectPath)
		return this.distFolderFilter.fetch(projectPath)
	}
}