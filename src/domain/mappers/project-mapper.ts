// src/domain/mappers/project-mapper.ts
import { Project } from "@domain/entities/project"
import { ProjectDto } from "../types/project"

export class ProjectMapper {
	/** Convert Project entity → marshalled project for storage/transfer */
	static toDto(project: Project): ProjectDto {
		return {
			id: project.id,
			owner: project.owner,
			name: project.name,
			description: project.description,
			created: project.created,
			updated: project.updated,
			deploymentId: project.deploymentId,
		}
	}

	/** Convert marshalled project (e.g., from DB) → Project entity */
	static toDomain(data: ProjectDto): Project {
		return Project.restore(data)
	}
}
