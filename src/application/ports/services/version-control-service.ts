import { Version } from "@domain/version"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export interface VersionControlService {
	init(auth: Auth<UserData>): Promise<string>
	pull(repositoryId: string, auth: Auth<UserData>): Promise<Version>
	push(version: Version, auth: Auth<UserData>): Promise<void>
}
