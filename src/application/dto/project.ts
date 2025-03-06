export interface ProjectDto {
	id: string
	name?: string
	description?: string
	owner?: string
	context?: string
	files?: FileContextDto
	createdAt?: Date
	updatedAt?: Date
}

interface FileContextDto {
	[filePath: string]: string | undefined
  }


export interface ProductOwnerOutputDto {
	projectDetails: ProjectDto
	ticket: string
}