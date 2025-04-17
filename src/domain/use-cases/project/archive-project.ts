import { Project } from "@domain/entities/project"

export interface ArchiveProject {
    execute(projectId: string): Promise<Project>
}
