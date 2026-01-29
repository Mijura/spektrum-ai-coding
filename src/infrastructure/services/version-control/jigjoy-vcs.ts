import { VersionControlService } from "@app/ports/services/version-control-service"
import { Version } from "@domain/version"
import { PlatformSDK } from "@jigjoy-io/platform-sdk"

export class JigJoyVersionControl implements VersionControlService {
    private readonly jigjoyClient: PlatformSDK
	constructor() {
		const API_GATEWAY = process.env.API_GATEWAY || ""
		this.jigjoyClient = new PlatformSDK(`${API_GATEWAY}`)
    }

	async init(): Promise<string> {
		return await this.jigjoyClient.versioning.initializeProjectHistory()
	}

	async pull(repositoryId: string): Promise<Version> {
		const response = await this.jigjoyClient.versioning.getLatestVersion(repositoryId)

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
		await this.jigjoyClient.versioning.saveVersion(versionDTO)
	}
}
