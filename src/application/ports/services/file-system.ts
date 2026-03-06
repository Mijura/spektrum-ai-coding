export interface FileSystemPort {
	copyFolder(source: string, destination: string): Promise<void>
	writeFile(path: string, content: string): Promise<void>
	exists(path: string): Promise<boolean>
	ensureFile(path: string): Promise<void>
	ensureDir(path: string): Promise<void>
	readDirectory(path: string): Promise<string[]>
	isDirectory(path: string): Promise<boolean>
	readFile(path: string, encoding: string): Promise<string>
	createReadStream(filePath: string): NodeJS.ReadableStream
	removeDir(path: string): Promise<void>
}
