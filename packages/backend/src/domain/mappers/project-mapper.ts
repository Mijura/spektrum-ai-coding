// src/domain/mappers/project-mapper.ts
import { Project } from "@domain/entities/project"
import { MarshalledProject } from "../types/project"

export class ProjectMapper {
	/** Convert Project entity → MarshalledProject for storage/transfer */
	static marshal(project: Project): MarshalledProject {
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

	/** Convert MarshalledProject (e.g., from DB) → Project entity */
	static unmarshal(data: MarshalledProject): Project {
		return Project.restore(data)
	}
}
