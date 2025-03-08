import path from "path"
import { PackageManager } from "@domain/utils/package-manager"
import { FileSystemPort } from "@domain/persistence/file-system"
import { SourceCode } from "@domain/model/source-code"
import { FrontendDevelopmentPort } from "@domain/services/frontend-development"

export class FrontendDevelopmentService implements FrontendDevelopmentPort{

	constructor(
		private readonly packageManager: PackageManager,
        private readonly fileSystem: FileSystemPort
	) {}


	async setupProject(projectId: string): Promise<void> {
		try {
			const projectPath: string = path.join("projects", projectId) 

			const templateName = "rspack-react-tailwind" 
			const templatePath = path.resolve(`src/application/templates/${templateName}`)

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
	

	async installDependencies(projectId: string): Promise<void> {
		const projectPath: string = path.join("projects", projectId)
		const installSuccess = await this.packageManager.installDependencies(projectPath)
		if (!installSuccess) {
			throw new Error("Failed to install dependencies.")
		}
	  }

	async buildProject(projectId: string): Promise<void> {
		const projectPath: string = path.join("projects", projectId)
		const buildSuccess = await this.packageManager.buildProject(projectPath)
		if (!buildSuccess) {
			throw new Error("Failed to build the project.")
		}
	}

	async fetchSourceCode(projectId: string): Promise<SourceCode> {
		const projectPath = path.join("projects", projectId)
		const sourceCode: SourceCode = {}
		const blacklist = new Set(["yarn.lock", ".env.example", "node_modules", "dist"])
	
		const readDir = async (directory: string, relativePath = "") => {
			const files = await this.fileSystem.readDirectory(directory)
	
			for (const file of files) {
				if (blacklist.has(file)) continue
	
				const filePath = path.join(directory, file)
				const fileRelativePath = path.join(relativePath, file)
	
				if (await this.fileSystem.isDirectory(filePath)) {
					await readDir(filePath, fileRelativePath)
				} else {
					sourceCode[fileRelativePath] = {
						code: await this.fileSystem.readFile(filePath, "utf8"),
					}
				}
			}
		}
	
		await readDir(projectPath)
		return sourceCode
	}
	
	async updateSourceCode(projectId: string, sourceCode: SourceCode): Promise<void> {
		const projectPath = path.resolve(`projects/${projectId}`)
		let promises = []
		for (const [filePath, fileDetails] of Object.entries(sourceCode)) {
			const fullPath = path.join(projectPath, filePath)
			await this.fileSystem.ensureFile(fullPath)
			const writingPromise = await this.fileSystem.writeFile(fullPath, fileDetails.code)
			promises.push(writingPromise)
		}

		await Promise.all(promises)
	}

	async getStaticFilesPath(projectId: string): Promise<string | null> {
		const projectPath = path.resolve(`projects/${projectId}/dist`)
		return await this.fileSystem.exists(projectPath) ? projectPath : null
	}

	async getIndexFilePath(projectId: string): Promise<string | null> {
		const indexPath = path.resolve(`projects/${projectId}/dist/index.html`)
		return await this.fileSystem.exists(indexPath) ? indexPath : null
	}
}
