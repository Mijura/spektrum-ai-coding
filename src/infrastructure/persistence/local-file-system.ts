import { FileSystemPort } from "@domain/persistence/file-system"
import fs from "fs-extra"

export class LocalFileSystem implements FileSystemPort {
	
    async copyFolder(source: string, destination: string): Promise<void> {
		// Ensure the destination directory exists
		await fs.ensureDir(destination)

		// Copy the template files to the new project directory
		await fs.copy(source, destination)
	}

	async writeFile(path: string, content: string): Promise<void> {
		await fs.writeFile(path, content, "utf-8")
	}

	async ensureFile(path: string): Promise<void> {
		await fs.ensureFile(path)
	}

	async readDirectory(path: string): Promise<string[]> {
		return await fs.readdirSync(path)
	}
	async isDirectory(path: string): Promise<boolean> {
		return await fs.statSync(path).isDirectory()
	}
	async readFile(path: string): Promise<string> {
		return await fs.readFile(path, "utf8")
	}

	exists(filePath: string): boolean {
		return fs.existsSync(filePath)
	}
}
