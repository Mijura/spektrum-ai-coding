import { FileSystemPort } from "@domain/ports/file-system"
import { Template } from "@domain/ports/templates/template"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import path from "path"

export class RspackTemplate implements Template {
    
    constructor(
      private readonly fileSystem: FileSystemPort,
      private readonly templateName = "rspack-react-tailwind"
    ) {}

	fetchPrebuiltFiles(): Promise<FileArtifacts> {
		const templatePath = path.resolve(`src/application/templates/${this.templateName}`)
		return Promise.resolve({
			projectId: "123",
			createdAt: new Date(),
			outDir: templatePath
		})
	}
  
}