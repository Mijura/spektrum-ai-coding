import { ProjectStatus } from "@domain/entities/project"

export type ProjectDto = {
	id: string
	ownerId: string
	name: string
	description: string
	created: string
	updated: string | null
	deploymentId: string | null
	status: ProjectStatus
}

export interface SourceCodeDto {
	[filePath: string]: string
}