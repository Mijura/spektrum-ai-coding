/**
 * CompressorService is a service that allows you to compress and decompress files.
 */
export interface CompressorService {
    /**
     * Compresses a list of files into a buffer
     * @param files A list of files to compress
     * @returns A buffer containing the compressed files
     */
    compress(files: { [filePath: string]: string }): Promise<Buffer> 


    /**
     * Decompresses a buffer into an object
     * @param archive The buffer to decompress
     * @returns A object containing 
     */
    decompress(archive: Buffer): Promise<{ [filePath: string]: string }>
}