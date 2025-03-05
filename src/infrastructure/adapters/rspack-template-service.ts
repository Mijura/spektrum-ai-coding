// src/infrastructure/adapters/RspackTemplateService.ts
import { FileSystemPort } from "@domain/ports/outbound/file-system-port"
import { TemplateServicePort } from "@domain/ports/outbound/template-service-port"
import path from "path"

export class RspackTemplateService implements TemplateServicePort {
	constructor(private readonly fileSystem: FileSystemPort) {}

	async copyProjectTemplate(projectPath: string): Promise<void> {
		try {
			const templateName = "rspack-react-tailwind" // The template name
			const templatePath = path.resolve(`project-templates/${templateName}`) // Path to the template

			console.log("Checking template path:", templatePath)

			// Use FileSystemPort to copy files
			await this.fileSystem.copyFolder(templatePath, projectPath)
			console.log(`✅ Project template copied to ${projectPath}`)
		} catch (error) {
			console.error("❌ Error setting up project template:", error)
			throw new Error("Failed to setup project template.")
		}
	}
}
