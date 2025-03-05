export interface FileSystemPort {
	copyFolder(source: string, destination: string): Promise<void>
	writeFile(path: string, content: string): Promise<void>
}
