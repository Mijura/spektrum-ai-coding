
import { v4 as uuidv4 } from "uuid"
import { ActivityData, ActivityMetadata, ActivityType } from "@domain/value-objects/activity"

export class Activity<T> {
    constructor(
      public readonly id: string,
      public readonly type: ActivityType,
      public readonly projectId: string,
      public readonly taskId: string,
      public readonly userId: string,
      public readonly metadata: T,
      public readonly occurredAt: string
    ) {}
    
    static rehydrate(data: ActivityData): Activity<ActivityMetadata> {
        return new Activity(data.id, data.type, data.projectId, data.taskId, data.userId, data.metadata, data.occurredAt)
    }

    protected static generateId() {
        return uuidv4()
    }
      
    protected static now() {
        return new Date().toISOString()
    }
  }
  