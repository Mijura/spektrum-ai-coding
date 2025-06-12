
import fs from "fs-extra"
import { FileSystemPort } from "../interfaces/file-system"

export class NodeFileSystem implements FileSystemPort {
	
    async copyFolder(source: string, destination: string): Promise<void> {
		await this.ensureDir(destination)
		await fs.copy(source, destination)
	}
	async writeFile(path: string, content: string): Promise<void> {
		await fs.writeFile(path, content, "utf-8")
	}
	async ensureFile(path: string): Promise<void> {
		await fs.ensureFile(path)
	}
	async ensureDir(path: string): Promise<void> {
		await fs.ensureDir(path)
	}
	async readDirectory(path: string): Promise<string[]> {
		return await fs.readdirSync(path)
	}
	async isDirectory(path: string): Promise<boolean> {
		return await fs.stat(path).then(stats => stats.isDirectory())
	}
	async readFile(path: string): Promise<string> {
		return await fs.readFile(path, "utf8")
	}
	async exists(filePath: string): Promise<boolean> {
		return await fs.exists(filePath)
	}
	async removeDir(path: string): Promise<void> {
		await fs.remove(path)
	}
	createReadStream(filePath: string): NodeJS.ReadableStream {
		return fs.createReadStream(filePath)
	}
}
