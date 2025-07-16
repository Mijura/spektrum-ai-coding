import { Version } from "@domain/value-objects/version"

export interface VersionRepository {
    save(version: Version): Promise<Version>
    get(versionId: string): Promise<Version | null>
    getAll(projectId: string): Promise<Version[]>
}