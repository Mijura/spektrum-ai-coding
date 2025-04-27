import { CommentLeftMetadata } from "@domain/entities/activities/comment-left"
import { DescriptionUpdatedMetadata } from "@domain/entities/activities/description-updated"
import { IssueCreatedMetadata } from "@domain/entities/activities/issue-created"
import { TitleUpdatedMetadata } from "@domain/entities/activities/title-updated"
import { WorkflowRunMetadata } from "@domain/entities/activities/workflow-run"

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

export interface ActivityDto {
	id: string
	type: ActivityType
	issueId: string
	userId: string
	metadata: ActivityMetadata
	occurredAt: string
}