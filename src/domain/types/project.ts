export type ProjectDto = {
	id: string
	ownerId: string
	name: string
	description: string
	created: string
	updated: string | null
	deploymentId: string | null
}

export interface SourceCodeDto {
	[filePath: string]: string
}