import { Version } from "@domain/version"

export interface VersionControlService {
	init(): Promise<string>
	pull(repositoryId: string): Promise<Version>
	push(version: Version): Promise<void>
}
