import { VersionControlSystem } from "@domain/ports/version-control-system"
import { FileArtifacts } from "@honeycomb-app/file-artifacts"
import { JigJoyVCS } from "@honeycomb-app/vcs-sdk"

export class JigJoyVCSAdapter implements VersionControlSystem {

	private readonly vcs: JigJoyVCS = new JigJoyVCS()

	async createRepository(): Promise<string> {
		return await this.vcs.createRepository()
	}

	async commit(repositoryId: string, fileArtifacts: FileArtifacts): Promise<void> {
		return await this.vcs.commitVersion(repositoryId, fileArtifacts)
	}


	async pull(repositoryId: string): Promise<FileArtifacts> {
		return await this.vcs.pullSourceCod(repositoryId)
	}



}
