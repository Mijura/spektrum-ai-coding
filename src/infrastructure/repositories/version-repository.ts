import { Version } from "@domain/entities/version"
import { VersionRepository } from "@domain/ports/repositories/version-repository"

export class DynamoDBVersionRepository implements VersionRepository {
    save(version: Version): Promise<Version> {
        throw new Error("Method not implemented.")
    }
    get(versionId: string): Promise<Version | null> {
        throw new Error("Method not implemented.")
    }
    getAll(projectId: string): Promise<Version[]> {
        throw new Error("Method not implemented.")
    }

}