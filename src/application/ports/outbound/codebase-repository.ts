import { Codebase } from "@domain/entities/codebase"

export interface CodebaseRepositoryPort {
    get(projectId: string): Promise<Codebase>
    save(codebase: Codebase): Promise<void>
}