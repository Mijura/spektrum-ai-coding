import { TemplateRepositoryPort } from "@app/ports/repositories/template-repository"
import { FileSelectionFilter } from "@infra/services/filesystem/file-selection-filter"
import { FileArtifacts } from "@domain/file-artifacts"
import path from "path"

export class RspackTemplateRepository implements TemplateRepositoryPort {
	private readonly templateName = "rspack-react-tailwind"

	constructor(
		private readonly sourceCodeFilter: FileSelectionFilter,
		private readonly distFolderFilter: FileSelectionFilter,
	) {}

	fetchPrebuiltFiles(): Promise<FileArtifacts> {
		const templatePath = path.resolve(`src/infrastructure/repositories/template/${this.templateName}`)
		return this.distFolderFilter.fetch(templatePath)
	}

	fetchSourceCode(): Promise<FileArtifacts> {
		const templatePath = path.resolve(`src/infrastructure/repositories/template/${this.templateName}`)
		return this.sourceCodeFilter.fetch(templatePath)
	}
}
