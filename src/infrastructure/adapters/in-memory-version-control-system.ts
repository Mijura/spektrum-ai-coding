import { VersionControlSystem } from "@domain/ports/version-control-system"
import { Commit } from "@domain/value-objects/commit"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { Version } from "@domain/value-objects/version"
import { v4 as uuidv4 } from 'uuid'

export class InMemoryVersionControlSystem implements VersionControlSystem {
    // Store commits by project ID and version tag
    private commits: Map<string, Map<string, Commit>> = new Map()
    // Store versions by project ID
    private versions: Map<string, Version[]> = new Map()

    async commitVersion(projectId: string, commit: Commit): Promise<Version> {
        // Create a new version
        const versionTag = uuidv4()
        const version = Version.create(
            projectId,
            `memory://${projectId}/build/${versionTag}`,
            `memory://${projectId}/source/${versionTag}`
        )

        // Store the commit
        if (!this.commits.has(projectId)) {
            this.commits.set(projectId, new Map())
        }
        this.commits.get(projectId)!.set(versionTag, commit)

        // Store the version
        if (!this.versions.has(projectId)) {
            this.versions.set(projectId, [])
        }
        this.versions.get(projectId)!.push(version)

        return version
    }

    async pullSourceCode(version: Version): Promise<FileArtifacts> {
        const projectId = version.projectId
        const versionTag = version.tag

        const projectCommits = this.commits.get(projectId)
        if (!projectCommits) {
            throw new Error(`No commits found for project ${projectId}`)
        }

        const commit = projectCommits.get(versionTag)
        if (!commit) {
            throw new Error(`No commit found for version ${versionTag} in project ${projectId}`)
        }

        return commit.sourceCode
    }

    async pullBuildArtifact(version: Version): Promise<FileArtifacts> {
        const projectId = version.projectId
        const versionTag = version.tag

        const projectCommits = this.commits.get(projectId)
        if (!projectCommits) {
            throw new Error(`No commits found for project ${projectId}`)
        }

        const commit = projectCommits.get(versionTag)
        if (!commit) {
            throw new Error(`No commit found for version ${versionTag} in project ${projectId}`)
        }

        return commit.buildArtifact
    }
}