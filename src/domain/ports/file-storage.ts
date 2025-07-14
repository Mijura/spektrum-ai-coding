export interface FileStorage {
    upload(fileName: string, stream: NodeJS.ReadableStream): Promise<void>
    download(fileName: string): Promise<Buffer>
}