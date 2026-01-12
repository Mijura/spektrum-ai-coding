import { FileSystemServicePort } from "@application/ports/services/file-system-service"
import { FileSelectionFilter } from "@infrastructure/services/filesystem/file-selection-filter"
import { FileArtifacts } from "@domain/file-artifacts"
import path from "path"

export class SourceCodeFilter implements FileSelectionFilter {
	constructor(private fileSystem: FileSystemServicePort) {}

	async fetch(basePath: string): Promise<FileArtifacts> {
		const sourceCode: FileArtifacts = {}
		const blacklist = new Set([".env.example", "node_modules", "dist", "package-lock.json", "yarn.lock"])

		const readDir = async (directory: string, relativePath = "") => {
			const files = await this.fileSystem.readDirectory(directory)

			for (const file of files) {
				const filePath = path.join(directory, file)
				const fileRelativePath = path.join(relativePath, file)

				const isDir = await this.fileSystem.isDirectory(filePath)
				const baseName = path.basename(fileRelativePath)

				if (blacklist.has(baseName)) continue

				if (isDir) {
					await readDir(filePath, fileRelativePath)
				} else {
					sourceCode[fileRelativePath] = await this.fileSystem.readFile(filePath, "utf8")
				}
			}
		}

		await readDir(basePath)
		return sourceCode
	}
}
