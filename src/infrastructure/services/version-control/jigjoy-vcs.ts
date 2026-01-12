import { VersionControlPort } from "@application/ports/services/version-control"
import { Version } from "@application/value-objects/version"
import { ProjectVersioningClient } from "@jigjoy-io/project-versioning-client"

export class JigJoyVCS implements VersionControlPort {
	private readonly projectVersioning: ProjectVersioningClient
	constructor() {
		const projectVersioningEndpoint = process.env.PROJECT_VERSIONING_ENDPOINT
		if (!projectVersioningEndpoint) {
			throw new Error("PROJECT_VERSIONING_ENDPOINT is not set")
		}

		this.projectVersioning = new ProjectVersioningClient(projectVersioningEndpoint)
	}

	async init(): Promise<string> {
		return await this.projectVersioning.initializeProjectHistory()
	}

	async pull(repositoryId: string): Promise<Version> {
		const response = await this.projectVersioning.getLatestVersion(repositoryId)

		const version: Version = {
			repositoryId: response.projectHistoryId,
			buildArtifacts: response.buildArtifacts,
			sourceCodeArtifacts: response.sourceCodeArtifacts,
		}

		return version
	}
	async push(version: Version): Promise<void> {
		const versionDTO = {
			projectHistoryId: version.repositoryId,
			buildArtifacts: version.buildArtifacts,
			sourceCodeArtifacts: version.sourceCodeArtifacts,
		}
		await this.projectVersioning.saveVersion(versionDTO)
	}
}
