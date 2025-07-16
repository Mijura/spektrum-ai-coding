import { Version } from "@domain/entities/version"
import { FileStorage } from "@domain/ports/file-storage"
import { FileSystemPort } from "@domain/ports/file-system"
import { PackageManager } from "@domain/ports/package-manager"
import { FrontendDeploymentService } from "@domain/ports/services/frontend-deployment"
import path from "path"

export class Environment implements FrontendDeploymentService {
    constructor(
        private readonly fileStorage: FileStorage,
        private readonly fileSystem: FileSystemPort,
        private readonly packageManager: PackageManager
    ) {}

    private async uploadFiles(sourceCodeFolder: string, destinationFolder: string) {
		const allFiles = await this.fileSystem.readDirectory(sourceCodeFolder)

		for (const fileName of allFiles) {
			const fullPath = path.join(sourceCodeFolder, fileName)
			const stream = this.fileSystem.createReadStream(fullPath)
			await this.fileStorage.upload(fileName, stream)
		}
	}

    async deploy(projectPath: string, version: Version, shouldBuild: boolean = true): Promise<string> {
        
        if (shouldBuild) {
            // Deploy the updated source code
            await this.packageManager.install(projectPath)
            await this.packageManager.build(projectPath)
        }

        const buildPath: string = path.resolve(`${projectPath}/dist`)
        const destinationFolder: string = `${version.projectId}`
        await this.uploadFiles(buildPath, projectPath)
        
        
        return "https://www.google.com"
    }
}