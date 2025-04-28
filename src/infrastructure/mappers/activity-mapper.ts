import { Activity } from "@domain/entities/activity"
import { ActivityData, ActivityMetadata } from "@domain/types/activity"

export class ActivityMapper {

    static toRecord(activity: Activity<ActivityMetadata>): ActivityData {
        return {
            id: activity.id,
            type: activity.type,
            issueId: activity.issueId,
            userId: activity.userId,
            metadata: activity.metadata,
            occurredAt: activity.occurredAt,
        }
    }

    static toDomain(data: ActivityData): Activity<ActivityMetadata> {
        return new Activity(data.id, data.type, data.issueId, data.userId, data.metadata, data.occurredAt)
    }
}

