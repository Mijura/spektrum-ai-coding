export interface SourceCodeDto {
	[filePath: string]: {
		context?: string
		code: string
	}
}