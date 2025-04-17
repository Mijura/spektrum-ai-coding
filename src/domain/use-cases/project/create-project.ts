import { Project } from "@domain/entities/project"

export interface CreateProject {
    execute(owner: string): Promise<Project>
}
