export interface FileStorage {
    uploadFile(fileName: string, stream: NodeJS.ReadableStream, destinationFolder: string): Promise<void>
}