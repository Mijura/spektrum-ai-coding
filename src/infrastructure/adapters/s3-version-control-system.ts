import { Version } from "@domain/value-objects/version"
import { CompressorService } from "@domain/ports/compressor-service"
import { VersionControlSystem } from "@domain/ports/version-control-system"
import { Readable } from "stream"
import { Commit } from "@domain/value-objects/commit"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { FileStorage } from "@infrastructure/ports/file-storage"
import { VersionRepository } from "@domain/ports/repositories/version-repository"
import { v4 as uuidv4 } from 'uuid'

export class S3VersionControlSystem implements VersionControlSystem {
	constructor(
		private readonly fileStorage: FileStorage,
		private readonly compressorService: CompressorService,
		private readonly versionRepository: VersionRepository
	) {}

	async commitVersion(projectId: string, commit: Commit): Promise<Version> {


		const versionTag = uuidv4()
		const sourceCodePath = `${projectId}/sourceCode/${versionTag}.tar.gz`
		const buildArtifactPath = `${projectId}/buildArtifact/${versionTag}.tar.gz`

		const { buildArtifact, sourceCode } = commit
		await this.push(buildArtifactPath, buildArtifact)
		await this.push(sourceCodePath, sourceCode)

		// Save the version
		const version = Version.create(projectId, buildArtifactPath, sourceCodePath)
		//await this.versionRepository.save(version)
		return version
	}


	async pullSourceCode(version: Version): Promise<FileArtifacts> {
		return this.pull(version.sourceCodeUrl)
	}

	async pullBuildArtifact(version: Version): Promise<FileArtifacts> {
		return this.pull(version.buildArtifactUrl)
	}

	private async push(archivePath: string, fileArtifacts: FileArtifacts): Promise<void> {
		const bucket = process.env.VERSION_CONTROL_BUCKET
		if (!bucket) throw new Error('Missing VERSION_CONTROL_BUCKET env variable')

		const archive = await this.compressorService.compress(fileArtifacts)
		const stream = Readable.from(archive)

		await this.fileStorage.upload(bucket, archivePath, stream)
	}


	private async pull(archiveUrl: string): Promise<FileArtifacts> {
		const bucket = process.env.VERSION_CONTROL_BUCKET
		if (!bucket) throw new Error('Missing VERSION_CONTROL_BUCKET env variable')

		const buffer = await this.fileStorage.download(bucket, archiveUrl)
		return this.compressorService.decompress(buffer)
	}

}
