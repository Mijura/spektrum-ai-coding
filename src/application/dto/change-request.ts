import { ProjectDto } from "./project"

export type ChangeRequestDto = {
	id: string
	project: ProjectDto
	message: string
}