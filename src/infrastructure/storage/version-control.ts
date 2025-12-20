import { VersionControlPort } from "@application/ports/outbound/version-control"
import { Version } from "@application/value-objects/version"
import { ProjectVersioningClient } from "@jigjoy-io/project-versioning-client"

export class DefaultVersionControl implements VersionControlPort {
    
    constructor(readonly projectVersioning: ProjectVersioningClient){}
    
    async init(): Promise<string> {
        return await this.projectVersioning.initializeProjectHistory()
    }

    async pull(repositoryId: string): Promise<Version> {
        const response = await this.projectVersioning.getLatestVersion(repositoryId)

        const version: Version = {
            repositoryId: response.projectHistoryId,
            buildArtifacts: response.buildArtifacts,
            sourceCodeArtifacts: response.sourceCodeArtifacts
        }

        return version
    }
    async push(version: Version): Promise<void> {
        const versionDTO = {
            projectHistoryId: version.repositoryId,
            buildArtifacts: version.buildArtifacts,
            sourceCodeArtifacts: version.sourceCodeArtifacts
        }
        await this.projectVersioning.saveVersion(versionDTO)
    }
    
}