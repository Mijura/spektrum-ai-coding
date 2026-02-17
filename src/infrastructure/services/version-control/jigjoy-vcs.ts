import { VersionControlService } from "@app/ports/services/version-control-service"
import { Version } from "@domain/version"
import { SpektrumClient } from "@jigjoy-ai/spektrum-client"

export class JigJoyVersionControl implements VersionControlService {
    private readonly spektrumClient: SpektrumClient
	constructor() {
		const JIGJOY_API_ENDPOINT = process.env.JIGJOY_API_ENDPOINT || ""
		this.spektrumClient = new SpektrumClient(`${JIGJOY_API_ENDPOINT}`, { kind: "internal" , token: process.env.INTERNAL_SERVICE_TOKEN || "" })
    }

	async init(): Promise<string> {
		return await this.spektrumClient.versioning.initializeProjectHistory()
	}

	async pull(repositoryId: string): Promise<Version> {
		const response = await this.spektrumClient.versioning.getLatestVersion(repositoryId)

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
		await this.spektrumClient.versioning.saveVersion(versionDTO)
	}
}
