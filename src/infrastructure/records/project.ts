import { SourceCode } from "@domain/types/source-code"

export enum ProjectStatus {
	ACTIVE = "Active",
	ARCHIVED = "Archived",
}

export interface ProjectRecord {
	id: string
	ownerId: string
	name: string
	description: string
	created: string
	updated: string | null
	deploymentId: string | null
	status: ProjectStatus
	detailsUpdated: boolean
	artifact: SourceCode | null
}