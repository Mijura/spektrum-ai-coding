import { Project } from "@domain/entities/project"

export interface CreateProjectUseCase {
    execute(): Promise<Project>
}
