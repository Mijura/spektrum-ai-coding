import path from "path"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { FileStorage } from "@infrastructure/ports/file-storage"
import { FileSystemPort } from "@domain/ports/filesystem/file-system"
import { WebHostingService } from "@domain/ports/services/web-hosting-service"

export class S3HostingService implements WebHostingService {
    constructor(
        private readonly fileStorage: FileStorage,
        private readonly fileSystem: FileSystemPort
    ) {}

    async deployPrebuiltCode(buildArtifact: FileArtifacts): Promise<string> {
        
        // TODO: Write the files to the file system
        const sourceCodeFolder = 'dist'
        const allFiles = await this.fileSystem.readDirectory(buildArtifact.distPath)

        for (const fileName of allFiles) {
            const fullPath = path.join(sourceCodeFolder, fileName)
            const stream = this.fileSystem.createReadStream(fullPath)
            await this.fileStorage.upload(fileName, stream)
        }
                
                
        return "https://www.google.com"
    }

}