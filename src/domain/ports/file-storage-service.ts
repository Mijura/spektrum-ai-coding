/**
 * FileStorageService is a service that allows you to upload and download files to a storage system.
 */
export interface FileStorageService {
    uploadFile(key: string, content: Buffer): Promise<string> // returns public URL
    downloadFile(key: string): Promise<Buffer>
}
  