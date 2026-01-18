import { FileSystemPort } from "@app/ports/services/file-system"
import { Readable } from "stream"

export class InMemoryFileSystemPort implements FileSystemPort {
	private files: Map<string, string> = new Map()
	private directories: Set<string> = new Set()

	/**
	 * Seed a file with specific content.
	 */
	seedFile(path: string, content: string) {
		this.files.set(path, content)
	}

	/**
	 * Seed a directory.
	 */
	seedDirectory(path: string) {
		this.directories.add(path)
	}

	/**
	 * Clear all seeded files and directories.
	 */
	clear() {
		this.files.clear()
		this.directories.clear()
	}

	async copyFolder(source: string, destination: string): Promise<void> {
		// In-memory implementation: mark destination as directory
		this.directories.add(destination)
		// Copy all files that start with source path
		for (const [filePath, content] of this.files.entries()) {
			if (filePath.startsWith(source)) {
				const relativePath = filePath.substring(source.length)
				const newPath = destination + relativePath
				this.files.set(newPath, content)
			}
		}
	}

	async writeFile(path: string, content: string): Promise<void> {
		this.files.set(path, content)
	}

	async exists(path: string): Promise<boolean> {
		return this.files.has(path) || this.directories.has(path)
	}

	async ensureFile(path: string): Promise<void> {
		if (!this.files.has(path)) {
			this.files.set(path, "")
		}
	}

	async ensureDir(path: string): Promise<void> {
		this.directories.add(path)
	}

	async readDirectory(path: string): Promise<string[]> {
		const entries: string[] = []
		for (const filePath of this.files.keys()) {
			if (filePath.startsWith(path + "/") || filePath === path) {
				const relativePath = filePath.substring(path.length + 1)
				const firstSegment = relativePath.split("/")[0]
				if (firstSegment && !entries.includes(firstSegment)) {
					entries.push(firstSegment)
				}
			}
		}
		for (const dirPath of this.directories) {
			if (dirPath.startsWith(path + "/") || dirPath === path) {
				const relativePath = dirPath.substring(path.length + 1)
				const firstSegment = relativePath.split("/")[0]
				if (firstSegment && !entries.includes(firstSegment)) {
					entries.push(firstSegment)
				}
			}
		}
		return entries
	}

	async isDirectory(path: string): Promise<boolean> {
		return this.directories.has(path)
	}

	async readFile(path: string, encoding: string): Promise<string> {
		const content = this.files.get(path)
		if (content === undefined) {
			throw new Error(`File not found: ${path}`)
		}
		return content
	}

	createReadStream(filePath: string): NodeJS.ReadableStream {
		const content = this.files.get(filePath)
		if (content === undefined) {
			throw new Error(`File not found: ${filePath}`)
		}
		return Readable.from([content])
	}

	async removeDir(path: string): Promise<void> {
		this.directories.delete(path)
		// Remove all files that start with this path
		for (const filePath of this.files.keys()) {
			if (filePath.startsWith(path)) {
				this.files.delete(filePath)
			}
		}
	}
}
