export type CommentLeftMetadata = {
	commentId: string
    commentText: string
    edited: boolean
    lastEditedAt: string | null
}

export type TitleUpdatedMetadata = {
	message: string
	oldTitle: string
	newTitle: string
}

export type IssueCreatedMetadata = {
	message: string
	title: string
	description: string
}

export type DescriptionUpdatedMetadata = {
	message: string
	oldDescription: string
	newDescription: string
}

export enum WorkflowRunStatus {
    RUNNING = 'RUNNING',
    SUCCEEDED = 'SUCCEEDED',
    FAILED = 'FAILED'
}

export type WorkflowRunMetadata = {
    status: WorkflowRunStatus
	message: string
	phase: string
    error?: string
}

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

export type Pagination = {
    pageNumber: number
    pageSize: number
}

export const DefaultPagination: Pagination = {
    pageNumber: 1,
    pageSize: 5,
}

export type ActivityData = {
    id: string
    type: ActivityType
    projectId: string
    issueId: string
    userId: string
    metadata: ActivityMetadata
    occurredAt: string
}