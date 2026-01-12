import { Version } from "@domain/version"

export interface VersionControlServicePort {
	init(): Promise<string>
	pull(repositoryId: string): Promise<Version>
	push(version: Version): Promise<void>
}
