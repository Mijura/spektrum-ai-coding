import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { FileStorage } from "@infrastructure/ports/file-storage"
import { WebHostingService } from "@domain/ports/services/web-hosting-service"
import { Readable } from "stream"

export class S3HostingService implements WebHostingService {
    constructor(
        private readonly fileStorage: FileStorage
    ) {}

    async deployPrebuiltCode(projectId: string, buildArtifact: FileArtifacts): Promise<string> {
        const domain = process.env.WEB_HOSTING_DOMAIN
        // TODO: Write the files to the file system

        for (const [fileName, content] of Object.entries(buildArtifact)) {
            const stream = Readable.from([content])
            const key = `${projectId}/${fileName}`
            await this.fileStorage.upload(key, stream)
        }
                
                
        return `https://${projectId}.${domain}`      
    }

}