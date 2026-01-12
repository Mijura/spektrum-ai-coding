import { TemplateService } from "@application/ports/services/template-service"
import { FileSelectionFilter } from "@infrastructure/services/filesystem/file-selection-filter"
import { FileArtifacts } from "@application/value-objects/file-artifacts"
import path from "path"

export class RspackTemplateService implements TemplateService {
	private readonly templateName = "rspack-react-tailwind"

	constructor(
		private readonly sourceCodeFilter: FileSelectionFilter,
		private readonly distFolderFilter: FileSelectionFilter,
	) {}

	fetchPrebuiltFiles(): Promise<FileArtifacts> {
		const templatePath = path.resolve(`src/infrastructure/services/template/${this.templateName}`)
		return this.distFolderFilter.fetch(templatePath)
	}

	fetchSourceCode(): Promise<FileArtifacts> {
		const templatePath = path.resolve(`src/infrastructure/services/template/${this.templateName}`)
		return this.sourceCodeFilter.fetch(templatePath)
	}
}
