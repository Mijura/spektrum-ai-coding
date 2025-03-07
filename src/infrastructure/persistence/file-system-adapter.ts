import { FileSystemPort } from "@domain/utils/file-system"
import fs from "fs-extra"

export class FileSystem implements FileSystemPort {
	
     async copyFolder(source: string, destination: string): Promise<void> {
		// Ensure the destination directory exists
		await fs.ensureDir(destination)

		// Copy the template files to the new project directory
		await fs.copy(source, destination)
	}

	async writeFile(path: string, content: string): Promise<void> {
		await fs.writeFile(path, content, "utf-8")
	}

	exists(filePath: string): boolean {
		return fs.existsSync(filePath)
	}
}
