import { VersionRecord } from "./version"

export interface DeploymentRecord {
    url: string
    version: VersionRecord
}