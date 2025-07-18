import { Version } from "@domain/value-objects/version"
import { CompressorService } from "@domain/ports/compressor-service"
import { VersionControlSystem } from "@domain/ports/version-control-system"
import { Readable } from "stream"
import { Commit } from "@domain/value-objects/commit"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { FileStorage } from "@infrastructure/ports/file-storage"

export class S3VersionControlSystem implements VersionControlSystem {
  constructor(
    private readonly fileStorage: FileStorage,
    private readonly compressorService: CompressorService
  ) {}

  commitVersion(projectId: string, sourceCode: Commit): Promise<Version> {
    throw new Error("Method not implemented.")
  }
  pullSourceCode(version: Version): Promise<FileArtifacts> {
    throw new Error("Method not implemented.")
  }
  pullBuildArtifact(version: Version): Promise<FileArtifacts> {
    throw new Error("Method not implemented.")
  }

  async push(version: Version, sourceCode: FileArtifacts): Promise<void> {
    const archive = await this.compressorService.compress(sourceCode)
    const stream = Readable.from(archive)

    await this.fileStorage.upload(`${version.projectId}/${version.tag}.tar.gz`, stream)
  }

  async pull(version: Version): Promise<FileArtifacts> {
    const buffer = await this.fileStorage.download(`${version.projectId}/${version.tag}.tar.gz`)
    return this.compressorService.decompress(buffer)
  }

}
