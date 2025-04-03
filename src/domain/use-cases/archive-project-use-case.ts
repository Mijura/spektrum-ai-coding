import { Project } from "@domain/entities/project"

export interface ArchiveProjectUseCase {
    execute(projectId: string): Promise<Project>
}
