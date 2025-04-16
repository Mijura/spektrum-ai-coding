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
}