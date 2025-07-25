import { Deployment, Project, ProjectStatus } from "@domain/entities/project"


export interface ProjectDto {
  id: string
  ownerId: string
  name: string
  description: string
  created: string
  updated: string | null
  status: ProjectStatus
  detailsUpdated: boolean
  latestDevDeployment: Deployment | null
  latestProdDeployment: Deployment | null
}

export class ProjectDtoMapper {
  /** Maps a single domain Project entity to a DTO */
  static toDto(project: Project): ProjectDto {
    return {
      id: project.id,
      ownerId: project.ownerId,
      name: project.name,
      description: project.description,
      created: project.created,
      updated: project.updated,
      status: project.status,
      detailsUpdated: project.detailsUpdated,
      latestDevDeployment: project.latestDevDeployment,
      latestProdDeployment: project.latestProdDeployment
    }
  }

  /** Maps an array of domain Project entities to DTOs */
  static toDtos(projects: Project[]): ProjectDto[] {
    return projects.map(this.toDto)
  }
}
