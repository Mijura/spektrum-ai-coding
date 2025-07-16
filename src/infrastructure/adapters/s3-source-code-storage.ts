import { Version } from "@domain/value-objects/version"
import { CompressorService } from "@domain/ports/compressor-service"
import { FileStorage } from "@domain/ports/file-storage"
import { VersionControlSystem } from "@domain/ports/version-control-system"
import { SourceCode } from "@domain/value-objects/source-code"
import { Readable } from "stream"

export class S3VersionControlSystem implements VersionControlSystem {
  constructor(
    private readonly fileStorage: FileStorage,
    private readonly compressorService: CompressorService
  ) {}

  async push(version: Version, sourceCode: SourceCode): Promise<void> {
    const archive = await this.compressorService.compress(sourceCode)
    const stream = Readable.from(archive)

    await this.fileStorage.upload(`${version.projectId}/${version.id}.tar.gz`, stream)
  }

  async pull(version: Version): Promise<SourceCode> {
    const buffer = await this.fileStorage.download(`${version.projectId}/${version.id}.tar.gz`)
    return this.compressorService.decompress(buffer)
  }

}
