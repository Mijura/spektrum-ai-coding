import { Project } from "@domain/entities/project"
import { ProjectRecord } from "@infrastructure/records/project"
import { DeploymentMapper } from "./deployment-mapper"


export class ProjectMapper {

	/** Converts a Project domain entity to a raw DTO */
	static toRecord(project: Project): ProjectRecord {
		return {
			id: project.id,
			ownerId: project.ownerId,
			name: project.name,
			description: project.description,
			created: project.created,
			updated: project.updated,
			status: project.status,
			detailsUpdated: project.detailsUpdated,
			latestDevDeployment: project.latestDevDeployment ? DeploymentMapper.toRecord(project.latestDevDeployment) : null,
			latestProdDeployment: project.latestProdDeployment ? DeploymentMapper.toRecord(project.latestProdDeployment) : null
		}
	}

	/** Converts a raw DTO back to a Project domain entity */
	static toDomain(record: ProjectRecord): Project {
		return Project.rehydrate({
			id: record.id,
			ownerId: record.ownerId,
			name: record.name,
			description: record.description,
			created: record.created,
			updated: record.updated,
			status: record.status,
			detailsUpdated: record.detailsUpdated,
			latestDevDeployment: record.latestDevDeployment ? DeploymentMapper.toDomain(record.latestDevDeployment) : null,
			latestProdDeployment: record.latestProdDeployment ? DeploymentMapper.toDomain(record.latestProdDeployment) : null
		})
	}

	static toDomains(items: ProjectRecord[]): Project[] {
			let projects: Project[] = []
			for (const project of items) {
				projects.push(this.toDomain(project))
			}
			return projects
	}
}
