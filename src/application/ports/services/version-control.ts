import { Version } from "@application/value-objects/version"

export interface VersionControlPort {
	init(): Promise<string>
	pull(repositoryId: string): Promise<Version>
	push(version: Version): Promise<void>
}
