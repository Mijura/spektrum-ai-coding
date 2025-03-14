export type ProjectDTO = {
	id: string
	owner: string | null
	name: string
	description: string
	created: string
	updated: string | null
	deploymentId: string | null
}

export interface SourceCode {
	[filePath: string]: string
}