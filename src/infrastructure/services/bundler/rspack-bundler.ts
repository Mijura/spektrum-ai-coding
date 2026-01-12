import { Bundler } from "@application/ports/services/bundler"
import { FileSelectionFilter } from "@infrastructure/services/filesystem/file-selection-filter"
import { FileArtifacts } from "@application/value-objects/file-artifacts"
import { YarnPackageManager } from "./yarn-package-manager"

export class RspackBundler implements Bundler {
	constructor(
		private readonly yarnPackageManager: YarnPackageManager,
		private readonly distFolderFilter: FileSelectionFilter,
	) {}

	async bundle(projectPath: string): Promise<FileArtifacts> {
		await this.yarnPackageManager.install(projectPath)
		await this.yarnPackageManager.build(projectPath)
		return this.distFolderFilter.fetch(projectPath)
	}
}
