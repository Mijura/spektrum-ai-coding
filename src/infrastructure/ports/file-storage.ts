export interface FileStorage {
    upload(bucket: string, fileName: string, stream: NodeJS.ReadableStream): Promise<void>
    download(bucket: string, fileName: string): Promise<Buffer>
}