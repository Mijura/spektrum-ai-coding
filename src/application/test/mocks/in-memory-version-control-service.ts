import { VersionControlService } from "@app/ports/services/version-control-service"
import { Version } from "@domain/version"
import { FileArtifacts } from "@domain/file-artifacts"

export class InMemoryVersionControlService implements VersionControlService {
	private byRepositoryId: Map<string, Version> = new Map()
	private initResults: string[] = [] // Queue of repository IDs to return from init()
	private initCounter: number = 0

	private defaultVersion: Version = {
		repositoryId: "default-repository-id",
		buildArtifacts: new FileArtifacts(),
		sourceCodeArtifacts: new FileArtifacts(),
	}

	/**
	 * Provide deterministic output for pull for a specific repositoryId.
	 */
	seed(repositoryId: string, version: Version) {
		this.byRepositoryId.set(repositoryId, version)
	}

	/**
	 * Provide deterministic output for init. Adds repositoryId to the queue.
	 * The next call to init() will return the first repositoryId in the queue.
	 */
	seedInit(repositoryId: string) {
		this.initResults.push(repositoryId)
	}

	/**
	 * Provide fallback output when no repository-specific value is seeded.
	 */
	setDefault(version: Version) {
		this.defaultVersion = version
	}

	async init(): Promise<string> {
		if (this.initResults.length > 0) {
			return this.initResults.shift()!
		}
		return `repository-${Date.now()}-${this.initCounter++}`
	}

	async pull(repositoryId: string): Promise<Version> {
		return this.byRepositoryId.get(repositoryId) ?? this.defaultVersion
	}

	async push(version: Version): Promise<void> {
		this.byRepositoryId.set(version.repositoryId, version)
	}
}
