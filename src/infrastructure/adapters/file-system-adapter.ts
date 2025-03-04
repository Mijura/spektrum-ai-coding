import { FileSystem } from "@domain/ports/outbound/file-system"
import fs from "fs/promises"

export class FileSystemAdapter implements FileSystem {
	async copyFile(source: string, destination: string): Promise<void> {
		await fs.copyFile(source, destination)
	}

	async deleteFile(path: string): Promise<void> {
		await fs.unlink(path)
	}

	async readFile(path: string): Promise<string> {
		return await fs.readFile(path, "utf-8")
	}

	async writeFile(path: string, content: string): Promise<void> {
		await fs.writeFile(path, content, "utf-8")
	}
}
