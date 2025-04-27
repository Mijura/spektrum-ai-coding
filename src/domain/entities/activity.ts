
import { v4 as uuidv4 } from "uuid"
import { CommentLeftMetadata } from "./activities/comment-left"
import { TitleUpdatedMetadata } from "./activities/title-updated"
import { DescriptionUpdatedMetadata } from "./activities/description-updated"
import { IssueCreatedMetadata } from "./activities/issue-created"
import { WorkflowRunMetadata } from "./activities/workflow-run"
import { ActivityDto } from "@application/dto/activity"

export type ActivityMetadata = 
    CommentLeftMetadata | 
    TitleUpdatedMetadata | 
    DescriptionUpdatedMetadata | 
    IssueCreatedMetadata |
    WorkflowRunMetadata

export enum ActivityType {
    ISSUE_CREATED = 'IssueCreated',
    COMMENT_LEFT = 'CommentLeft',
    TITLE_UPDATED = 'TitleUpdated',
    DESCRIPTION_UPDATED = 'DescriptionUpdated',
    WORKFLOW_RUN = 'WorkflowRun'
}

export class Activity<T> {
    constructor(
      public readonly id: string,
      public readonly type: ActivityType,
      public readonly issueId: string,
      public readonly userId: string,
      public readonly metadata: T,
      public readonly occurredAt: string
    ) {}

    static toDto(activity: Activity<ActivityMetadata>): ActivityDto {
        return {
			id: activity.id,
			type: activity.type,
			issueId: activity.issueId,
			userId: activity.userId,
			metadata: activity.metadata,
			occurredAt: activity.occurredAt,
        }
      }
    
      static rehydrate(dto: ActivityDto): Activity<ActivityMetadata> {
        return new Activity(dto.id, dto.type, dto.issueId, dto.userId, dto.metadata, dto.occurredAt)
      }

      protected static generateId() {
        return uuidv4()
        }
      
      protected static now() {
        return new Date().toISOString()
      }
  }
  