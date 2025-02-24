export interface ProjectDto {
    projectId: string;
    sourceCode: SourceCode;
}
export type ChangeRequestDto = {
	id: string,
	project: ProjectDto,
	message: string
}

export interface SourceCode {
	[filePath: string]: string
}