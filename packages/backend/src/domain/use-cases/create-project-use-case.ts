import { Project } from "@domain/model/project"

export interface CreateProjectUseCase {
    execute(): Promise<Project>
}
