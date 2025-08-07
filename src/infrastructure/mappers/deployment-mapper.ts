import { Deployment } from "@domain/entities/project"
import { VersionMapper } from "./version-mapper"
import { DeploymentRecord } from "@infrastructure/records/deployment"

export class DeploymentMapper {

    static toRecord(deployment: Deployment): DeploymentRecord {
        return {
            url: deployment.url,
            version: VersionMapper.toRecord(deployment.version)
        }
    }

    static toDomain(record: DeploymentRecord): Deployment {
        return {
            url: record.url,
            version: VersionMapper.toDomain(record.version)
        }
    }

}