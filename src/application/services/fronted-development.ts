import path from "path"
import { PackageManager } from "@domain/utils/package-manager"
import { FileSystemPort } from "@domain/utils/file-system"
import { SourceCodeDto } from "@application/dto/source-code"

export class FrontendDevelopmentService {

	constructor(
		private readonly packageManager: PackageManager, // Adapter for package management
        private readonly fileSystem: FileSystemPort, // Adapter for file system operations
	) {}

	/**
	 * Initializes project by copying the template (project-templates/rspack-react-tailwind), installing dependencies, and building the project
	 * @param projectId - The ID of the project to initialize
	 */
	async setupProject(projectId: string): Promise<void> {
		try {
			const projectPath: string = path.join("projects", projectId) // Path for the new project

			const templateName = "rspack-react-tailwind" // The template name
			const templatePath = path.resolve(`src/application/templates/${templateName}`) // Path to the template

			console.log("Template path:", templatePath)

			// Use FileSystemPort to copy files
			await this.fileSystem.copyFolder(templatePath, projectPath)
			console.log(`✅ Project template copied to ${projectPath}`)


			await this.installDependencies(projectId)
			await this.buildProject(projectId)

			console.log(`Project ${projectId} initialized and built successfully!`)
		} catch (error) {
			console.error(`Error initializing project ${projectId}:`, error)
			throw new Error("Project initialization failed.")
		}
	}
	
	/**
	 * Installs dependencies for the project
	 * @param projectId - The ID of the project to install dependencies for
	 */
	async installDependencies(projectId: string): Promise<void> {
		const projectPath: string = path.join("projects", projectId)
		const installSuccess = await this.packageManager.installDependencies(projectPath)
		if (!installSuccess) {
			throw new Error("Failed to install dependencies.")
		}
	  }

	/**
	 * Builds the project
	 * @param projectId - The ID of the project to build
	 */
	async buildProject(projectId: string): Promise<void> {
		const projectPath: string = path.join("projects", projectId)
		const buildSuccess = await this.packageManager.buildProject(projectPath)
		if (!buildSuccess) {
			throw new Error("Failed to build the project.")
		}
	}

	/**
	 * Writes the source code to the project
	 * @param projectId - The ID of the project to write the source code to
	 * @param sourceCode - The source code to write to the project
	 */
	async editSourceCode(projectId: string, sourceCode: SourceCodeDto): Promise<void> {
		const projectPath = path.resolve(`projects/${projectId}`)
		let promises = []
		for (const [filePath, fileDetails] of Object.entries(sourceCode)) {
			const fullPath = path.join(projectPath, filePath)
			await this.fileSystem.ensureFile(fullPath)
			const writingPromise = this.fileSystem.writeFile(fullPath, fileDetails.code)
			promises.push(writingPromise)
		}

		await Promise.all(promises)
	}

	async getStaticFilesPath(projectId: string): Promise<string | null> {
		const projectPath = path.resolve(`projects/${projectId}/dist`)
		return this.fileSystem.exists(projectPath) ? projectPath : null
	}

	async getIndexFilePath(projectId: string): Promise<string | null> {
		const indexPath = path.resolve(`projects/${projectId}/dist/index.html`)
		return this.fileSystem.exists(indexPath) ? indexPath : null
	}
}
