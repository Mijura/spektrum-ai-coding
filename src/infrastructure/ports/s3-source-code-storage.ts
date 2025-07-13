import { S3Client } from "@aws-sdk/client-s3"
import { Version } from "@domain/entities/version"
import { CompressorService } from "@domain/ports/compressor-service"
import { FileStorage } from "@domain/ports/file-storage"
import { VersionControlSystem } from "@domain/ports/version-control-system"
import { SourceCode } from "@domain/types/source-code"
import { Readable } from "stream"

export class S3VersionControlSystem implements VersionControlSystem {
  constructor(
    private readonly fileStorage: FileStorage,
    private readonly compressorService: CompressorService
  ) {}

  async push(version: Version): Promise<void> {
    const archive = await this.compressorService.compress(version.sourceCode)
    const stream = Readable.from(archive)

    await this.fileStorage.uploadFile(`${version.projectId}/${version.id}.tar.gz`, stream, version.projectId)
  }

  async pull(versionId: string, projectId: string): Promise<SourceCode> {
    const buffer = await this.fileStorage.downloadFile(`${projectId}/${versionId}.tar.gz`)
    return this.compressorService.decompress(buffer)
  }

  async remove(versionId: string, projectId: string): Promise<void> {
    await this.fileStorage.removeFile(`${projectId}/${versionId}.tar.gz`)
  }
}
