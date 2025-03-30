// src/domain/mappers/project-mapper.ts
import { Project } from "@domain/entities/project"
import { ProjectDto } from "../types/project"

export class ProjectMapper {

	/** Convert Project entity → marshalled project for storage/transfer */
	static toDto(project: Project): ProjectDto {
		return {
			id: project.id,
			ownerId: project.ownerId,
			name: project.name,
			description: project.description,
			created: project.created,
			updated: project.updated,
			deploymentId: project.deploymentId,
		}
	}

	static toDtos(projects: Project[]): ProjectDto[] {
		let projectDtos: ProjectDto[] = []
		for (const project of projects) {
			projectDtos.push(this.toDto(project))
		}
		return projectDtos
	}

	/** Convert marshalled project (e.g., from DB) → Project entity */
	static toDomain(data: ProjectDto): Project {
		return Project.restore(data)
	}

	static toDomains(items: ProjectDto[]): Project[] {
		let projects: Project[] = []
		for (const project of items) {
			projects.push(this.toDomain(project))
		}
		return projects
	}
}
