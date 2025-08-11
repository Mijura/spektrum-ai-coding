import { Deployment } from "@domain/entities/project"

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
	status: ProjectStatus
	detailsUpdated: boolean
	devEnvironmentId: string
	prodEnvironmentId: string
	latestDevDeployment: Deployment | null
	latestProdDeployment: Deployment | null
}