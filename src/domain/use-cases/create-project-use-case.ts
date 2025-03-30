import { Project } from "@domain/entities/project"

export interface CreateProjectUseCase {
    execute(owner: string): Promise<Project>
}
