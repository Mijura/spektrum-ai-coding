export interface SourceCode {
	[filePath: string]: {
		context?: string
		code: string
	}
}