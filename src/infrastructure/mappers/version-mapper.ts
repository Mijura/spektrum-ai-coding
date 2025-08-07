import { Version } from "@domain/value-objects/version"
import { VersionRecord } from "@infrastructure/records/version"

export class VersionMapper {

    	/** Converts a Version value object to a raw DTO */
	static toRecord(version: Version): VersionRecord {
		return {
            tag: version.tag,
            projectId: version.projectId,
            buildArtifactUrl: version.buildArtifactUrl,
            sourceCodeUrl: version.sourceCodeUrl,
            createdAt: version.createdAt
		}
	}

	/** Converts a raw DTO back to a Version value object */
	static toDomain(record: VersionRecord): Version {
		return Version.rehydrate({
            tag: record.tag,
            projectId: record.projectId,
            buildArtifactUrl: record.buildArtifactUrl,
            sourceCodeUrl: record.sourceCodeUrl,
            createdAt: record.createdAt
		})
	}

}