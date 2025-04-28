
import { v4 as uuidv4 } from "uuid"
import { ActivityData, ActivityMetadata, ActivityType } from "@domain/types/activity"

export class Activity<T> {
    constructor(
      public readonly id: string,
      public readonly type: ActivityType,
      public readonly issueId: string,
      public readonly userId: string,
      public readonly metadata: T,
      public readonly occurredAt: string
    ) {}

    static toDto(activity: Activity<ActivityMetadata>): ActivityData {
        return {
			id: activity.id,
			type: activity.type,
			issueId: activity.issueId,
			userId: activity.userId,
			metadata: activity.metadata,
			occurredAt: activity.occurredAt,
        }
    }
    
    static rehydrate(data: ActivityData): Activity<ActivityMetadata> {
        return new Activity(data.id, data.type, data.issueId, data.userId, data.metadata, data.occurredAt)
    }

    protected static generateId() {
        return uuidv4()
    }
      
    protected static now() {
        return new Date().toISOString()
    }
  }
  