/**
 * CompressorService is a service that allows you to compress and decompress files.
 */
export interface CompressorService {
    compress(files: { [filePath: string]: string }): Promise<Buffer> // input: { path: content }
    decompress(archive: Buffer): Promise<{ [filePath: string]: string }>
}