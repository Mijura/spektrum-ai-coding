export interface ProjectDto {
	id: string
	name: string
	description: string
	owner: string
	deploymentId?: string
	created: Date
    updated: Date
}