export interface ProjectDto {
	projectId: string
	chatHistory?: string[]
	name?: string
	description?: string
	owner?: string
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
