export interface TemplateServicePort {
	copyProjectTemplate(projectPath: string): Promise<void>
}
