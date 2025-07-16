import { Project } from "@domain/entities/project"
import { Version } from "@domain/entities/version"

export enum EnvironmentType {
    DEV = "dev",
    PROD = "prod"
}
export abstract class Environment {

    abstract type: EnvironmentType

    abstract isInitialized(project: Project): Promise<boolean>

    abstract initialize(project: Project): Promise<void>

    deploy(project: Project): Promise<string> {
        if(!this.isInitialized(project)) {
            this.initialize(project)
        }

        return Promise.resolve("https://example.com")
    }
}