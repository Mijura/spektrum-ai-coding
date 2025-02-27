export interface ProjectDto {
    projectId: string;
    sourceCode: SourceCodeDto;
}
export type ChangeRequestDto = {
	id: string,
	project: ProjectDto,
	message: string
}

export interface SourceCodeDto {
	[filePath: string]: {
		context?: string,
		code: string
	}
}