import { Template } from "@domain/ports/templates/template"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { FileSelectionFilter } from "@domain/ports/filesystem/file-selection-filter"
import path from "path"

export class RspackTemplate implements Template {
    
    constructor(
      private readonly sourceCodeFilter: FileSelectionFilter,
      private readonly distFolderFilter: FileSelectionFilter,
      private readonly templateName = "rspack-react-tailwind"
    ) {}

	fetchPrebuiltFiles(): Promise<FileArtifacts> {
		const templatePath = path.resolve(`src/application/templates/${this.templateName}`)
		return this.distFolderFilter.fetch(templatePath)
	}

	fetchSourceCode(): Promise<FileArtifacts> {
		const templatePath = path.resolve(`src/application/templates/${this.templateName}`)
		return this.sourceCodeFilter.fetch(templatePath)
	}
  
}