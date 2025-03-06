import { ProjectDto } from "./project"

export type UserRequestDto = {
	id: string
	project: ProjectDto
	message: string
}