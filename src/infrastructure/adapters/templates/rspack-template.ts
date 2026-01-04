import { Template } from "@application/ports/outbound/template"
import { FileSelectionFilter } from "@application/ports/outbound/file-selection-filter"
import { FileArtifacts } from "@application/value-objects/file-artifacts"
import path from "path"

export class RspackTemplate implements Template {
	private readonly templateName = "rspack-react-tailwind"

	constructor(
		private readonly sourceCodeFilter: FileSelectionFilter,
		private readonly distFolderFilter: FileSelectionFilter,
	) {}

	fetchPrebuiltFiles(): Promise<FileArtifacts> {
		const templatePath = path.resolve(`src/infrastructure/adapters/templates/${this.templateName}`)
		return this.distFolderFilter.fetch(templatePath)
	}

	fetchSourceCode(): Promise<FileArtifacts> {
		const templatePath = path.resolve(`src/infrastructure/adapters/templates/${this.templateName}`)
		return this.sourceCodeFilter.fetch(templatePath)
	}
}
