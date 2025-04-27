import { CommentEditedMetadata } from "@domain/entities/activities/comment-edited"
import { CommentLeftMetadata } from "@domain/entities/activities/comment-left"
import { DescriptionUpdatedMetadata } from "@domain/entities/activities/description-updated"
import { IssueCreatedMetadata } from "@domain/entities/activities/issue-created"
import { TitleUpdatedMetadata } from "@domain/entities/activities/title-updated"
import { WorkflowFailedMetadata } from "@domain/entities/activities/workflow-failed"
import { WorkflowStartedMetadata } from "@domain/entities/activities/workflow-started"
import { WorkflowSucceededMetadata } from "@domain/entities/activities/workflow-succeeded"

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

export interface ActivityDto {
	id: string
	type: ActivityType
	issueId: string
	userId: string
	metadata: ActivityMetadata
	occurredAt: string
}