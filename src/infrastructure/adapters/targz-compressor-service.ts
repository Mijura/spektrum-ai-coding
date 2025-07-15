import * as tar from 'tar-stream'
import * as zlib from 'zlib'
import { Readable } from 'stream'
import { CompressorService } from '@domain/ports/compressor-service'

export class TarGzCompressorService implements CompressorService {
  async compress(files: Record<string, string>): Promise<Buffer> {
    const pack = tar.pack()

    for (const [filePath, content] of Object.entries(files)) {
      pack.entry({ name: filePath }, content)
    }

    pack.finalize()

    const tarStream = Readable.from(pack)
    const gzip = zlib.createGzip()

    return streamToBuffer(tarStream.pipe(gzip))
  }

  async decompress(archive: Buffer): Promise<Record<string, string>> {
    const result: Record<string, string> = {}
    const extract = tar.extract()
    const gunzip = zlib.createGunzip()

    extract.on('entry', (header, stream, next) => {
      let content = ''
      stream.on('data', chunk => (content += chunk.toString()))
      stream.on('end', () => {
        result[header.name] = content
        next()
      })
      stream.resume()
    })

    const stream = Readable.from(archive).pipe(gunzip).pipe(extract)
    await new Promise<void>((resolve, reject) => {
      extract.on('finish', resolve)
      extract.on('error', reject)
    })

    return result
  }
}

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}
