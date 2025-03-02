export interface ProjectDto {
	id: string
	chatHistory?: string[]
	name?: string
	description?: string
	owner?: string
	context?: string
}
export type ChangeRequestDto = {
	id: string
	project: ProjectDto
	message: string
}

export interface SourceCodeDto {
	[filePath: string]: {
		context?: string
		code: string
	}
}
