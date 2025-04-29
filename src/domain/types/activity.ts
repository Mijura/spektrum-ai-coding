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
    RUNNING = 'Running',
    SUCCEEDED = 'Succeeded',
    FAILED = 'Failed'
}

export type WorkflowRunMetadata = {
    workflowId: string
    status: WorkflowRunStatus
	message: string
	phase: string
    title: string
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

export type PaginationData = {
    pageNumber: number
    pageSize: number
}

export const DefaultPagination: PaginationData = {
    pageNumber: 1,
    pageSize: 5,
}

export type TimeRangeData = {
    startDate: string
    endDate: string
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