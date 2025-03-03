export interface ProjectDto {
	id: string
	name?: string
	description?: string
	owner?: string
	context?: string
	files?: FileContextDto
	
}

interface FileContextDto {
	[filePath: string]: string | undefined
  }


export interface ProductOwnerOutputDto {
	projectDetails: ProjectDto
	ticket: string
}