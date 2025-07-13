import { SourceCode } from "@domain/types/source-code"
import { v4 as uuidv4 } from 'uuid'

export enum Environment {
    DEV = "dev",
    PROD = "prod"
}

export class Version {
    public readonly id: string
    public readonly created: string
    public readonly projectId: string
    public readonly environment: Environment

    private constructor(id: string, created: string, projectId: string, environment: Environment) {
        this.id = id
        this.created = created
        this.projectId = projectId
        this.environment = environment
    }

    static create(projectId: string, environment: Environment): Version {
        const id = uuidv4()
        const created = new Date().toISOString()
        return new Version(id, created, projectId, environment)
    }
}