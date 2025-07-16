import { Version } from "@domain/value-objects/version"
import { FileStorage } from "@domain/ports/file-storage"
import { FileSystemPort } from "@domain/ports/file-system"
import { PackageManager } from "@infrastructure/ports/package-manager"
import { FrontendDeploymentService } from "@domain/ports/services/frontend-deployment"
import path from "path"
import { BuildArtifact } from "@domain/value-objects/file-artifacts"

export class Environment implements FrontendDeploymentService {
    constructor(
        private readonly fileStorage: FileStorage,
        private readonly fileSystem: FileSystemPort
    ) {}

    private async uploadFiles(sourceCodeFolder: string, destinationFolder: string) {

	}

    async deploy(buildArtifact: BuildArtifact): Promise<string> {
        

        const allFiles = await this.fileSystem.readDirectory(buildArtifact.distPath)

		for (const fileName of allFiles) {
			const fullPath = path.join(sourceCodeFolder, fileName)
			const stream = this.fileSystem.createReadStream(fullPath)
			await this.fileStorage.upload(fileName, stream)
		}
        
        
        return "https://www.google.com"
    }
}