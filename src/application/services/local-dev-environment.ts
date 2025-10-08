import path from "path"
import { FileArtifacts } from "@jigjoy-io/file-artifacts"
import { DevEnvironment } from "@domain/ports/services/dev-environment"
import { Bundler } from "@domain/ports/bundlers/bundler"
import { FileSystemPort } from "@domain/ports/filesystem/file-system"
import { v4 as uuidv4 } from 'uuid'

export class LocalDevEnvironment implements DevEnvironment {

	constructor(
		private readonly jsBundler: Bundler,
		private readonly fileSystem: FileSystemPort
	) {}

	async build(sourceCode: FileArtifacts): Promise<FileArtifacts> {
		const buildId = uuidv4()
		const temporaryBuildFolder = path.resolve(`projects/${buildId}`)		

		// write the source code to the file system
		let promises = []
		for (const [filePath, fileContent] of Object.entries(sourceCode)) {
			const fullPath = path.join(temporaryBuildFolder, filePath)
			await this.fileSystem.ensureFile(fullPath)
			const writingPromise = await this.fileSystem.writeFile(fullPath, fileContent)
			promises.push(writingPromise)
		}

		await Promise.all(promises)
		// Bundle the source code
		let buildArtifact: FileArtifacts
		try {
			buildArtifact = await this.jsBundler.bundle(temporaryBuildFolder)
		} finally {
			// Always clean up the temporary directory, regardless of success or failure
			await this.fileSystem.removeDir(temporaryBuildFolder)
		}
		return buildArtifact
	}


}
