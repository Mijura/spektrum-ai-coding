export interface ProjectDto {
	id: string
	name?: string
	description?: string
	owner?: string
	context?: string
}


export interface ProductOwnerOutputDto {
	projectDetails: ProjectDto
	ticket: string
}