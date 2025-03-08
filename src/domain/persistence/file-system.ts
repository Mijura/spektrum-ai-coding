export interface FileSystemPort {
	copyFolder(source: string, destination: string): Promise<void>
	writeFile(path: string, content: string): Promise<void>
    exists(path: string): boolean
	ensureFile(path: string): Promise<void>
}
