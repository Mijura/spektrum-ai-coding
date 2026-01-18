import { FileSystemPort } from "@app/ports/services/file-system"
import fse from "fs-extra"

export class LocalFileSystem implements FileSystemPort {
	async copyFolder(source: string, destination: string): Promise<void> {
		await this.ensureDir(destination)
		await fse.copy(source, destination)
	}

	async writeFile(path: string, content: string): Promise<void> {
		await fse.writeFile(path, content, "utf-8")
	}

	async ensureFile(path: string): Promise<void> {
		await fse.ensureFile(path)
	}

	async ensureDir(path: string): Promise<void> {
		await fse.ensureDir(path)
	}

	async readDirectory(path: string): Promise<string[]> {
		return await fse.readdirSync(path)
	}

	async isDirectory(path: string): Promise<boolean> {
		return await fse.stat(path).then((stats) => stats.isDirectory())
	}

	async readFile(path: string): Promise<string> {
		return await fse.readFile(path, "utf8")
	}

	async exists(filePath: string): Promise<boolean> {
		return await fse.exists(filePath)
	}

	async removeDir(path: string): Promise<void> {
		await fse.remove(path)
	}

	createReadStream(filePath: string): NodeJS.ReadableStream {
		return fse.createReadStream(filePath)
	}
}
