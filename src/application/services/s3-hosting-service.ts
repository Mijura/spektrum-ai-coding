import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { FileStorage } from "@infrastructure/ports/file-storage"
import { WebHostingService } from "@domain/ports/services/web-hosting-service"
import { Readable } from "stream"

export class S3HostingService implements WebHostingService {
    constructor(
        private readonly fileStorage: FileStorage
    ) {}

    async deployPrebuiltCode(buildArtifact: FileArtifacts): Promise<string> {
        
        // TODO: Write the files to the file system

        for (const [fileName, content] of Object.entries(buildArtifact)) {
            const stream = Readable.from([content])
            await this.fileStorage.upload(fileName, stream)
        }
                
                
        return "https://jigjoy.io"
    }

}