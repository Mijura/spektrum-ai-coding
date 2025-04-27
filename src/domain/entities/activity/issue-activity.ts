import { ActivityDto } from "@application/dto/ticket"
import { v4 as uuidv4 } from "uuid"
import { CommentEditedMetadata } from "./activities/comment-edited"
import { CommentLeftMetadata } from "./activities/comment-left"
import { TitleUpdatedMetadata } from "./activities/title-updated"
import { DescriptionUpdatedMetadata } from "./activities/description-updated"
import { IssueCreatedMetadata } from "./activities/issue-created"
import { WorkflowStartedMetadata } from "./activities/workflow-started"
import { WorkflowSucceededMetadata } from "./activities/workflow-succeeded"
import { WorkflowFailedMetadata } from "./activities/workflow-failed"

export type ActivityMetadata = 
    CommentLeftMetadata | 
    CommentEditedMetadata | 
    TitleUpdatedMetadata | 
    DescriptionUpdatedMetadata | 
    IssueCreatedMetadata | 	
    WorkflowStartedMetadata |
    WorkflowSucceededMetadata |
    WorkflowFailedMetadata

export enum ActivityType {
    ISSUE_CREATED = 'IssueCreated',
    COMMENT_LEFT = 'CommentLeft',
    COMMENT_EDITED = 'CommentEdited',
    TITLE_UPDATED = 'TitleUpdated',
    DESCRIPTION_UPDATED = 'DescriptionUpdated',
    WORKFLOW_STARTED = 'WorkflowStarted',
    WORKFLOW_SUCCEEDED  = 'WorkflowSucceeded',
    WORKFLOW_FAILED = 'WorkflowFailed',
  }

export class IssueActivity {
    constructor(
      public readonly id: string,
      public readonly type: ActivityType,
      public readonly ticketId: string,
      public readonly userId: string,
      public readonly metadata: ActivityMetadata,
      public readonly occurredAt: string
    ) {}

    static toDto(activity: IssueActivity): ActivityDto {
        return {
          id: activity.id,
          type: activity.type,
          ticketId: activity.ticketId,
          userId: activity.userId,
          metadata: activity.metadata,
          occurredAt: activity.occurredAt,
        }
      }
    
      static rehydrate(dto: ActivityDto): IssueActivity {
        return new IssueActivity(dto.id, dto.type, dto.ticketId, dto.userId, dto.metadata, dto.occurredAt)
      }

      protected static generateId() {
        return uuidv4()
        }
      
      protected static now() {
        return new Date().toISOString()
      }
  }
  