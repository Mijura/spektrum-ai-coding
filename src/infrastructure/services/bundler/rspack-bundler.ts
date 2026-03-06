import { BundlerPort } from "@app/ports/services/bundler"
import { FileSelectionFilter } from "@infra/services/filesystem/file-selection-filter"
import { FileArtifacts } from "@domain/file-artifacts"
import { YarnPackageManager } from "./yarn-package-manager"

export class RspackBundlerService implements BundlerPort {
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
