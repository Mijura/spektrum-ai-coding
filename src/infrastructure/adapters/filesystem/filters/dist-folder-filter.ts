import { FileSelectionFilter } from "@domain/ports/filesystem/file-selection-filter"
import { FileSystemPort } from "@jigjoy-io/file-artifacts-storage"
import { FileArtifacts } from "@jigjoy-io/project-artifacts-client"
import path from "path"

export class DistFolderFilter implements FileSelectionFilter {

  constructor(private fileSystem: FileSystemPort) {}

  async fetch(basePath: string): Promise<FileArtifacts> {
    const fileArtifacts: FileArtifacts = {}
    const distPath = path.join(basePath, "dist")

    const readDir = async (directory: string, relativePath = "") => {
        const files = await this.fileSystem.readDirectory(directory)

        for (const file of files) {
            const fullPath = path.join(directory, file)
            const relPath = path.join(relativePath, file)
            const isDir = await this.fileSystem.isDirectory(fullPath)

            if (isDir) {
                await readDir(fullPath, relPath)
            } else {
                fileArtifacts[relPath] = await this.fileSystem.readFile(fullPath, "utf8")
            }
        }
    }

    const distExists = await this.fileSystem.exists(distPath)
    if (distExists) {
      await readDir(distPath)
    }

    return fileArtifacts
  }
}
