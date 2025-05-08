export type CommentLeftMetadata = {
    commentText: string
    authorId: string
}

export type TitleUpdatedMetadata = {
	message: string
	oldTitle: string
	newTitle: string
}

export type TaskCreatedMetadata = {
	message: string
	title: string
	description: string
}

export type DescriptionUpdatedMetadata = {
	message: string
	oldDescription: string
	newDescription: string
}

export type StartedWorkMetadata = {
    workerId: string
    message: string
    phase: string
}

export type FinishedWorkMetadata = {
    workerId: string
    message: string
    phase: string
}

export type Comment = {
    authorId: string
    text: string
}


export enum WorkflowRunStatus {
    RUNNING = 'Running',
    SUCCEEDED = 'Succeeded',
    FAILED = 'Failed'
}

export type ActivityMetadata = 
    CommentLeftMetadata | 
    TitleUpdatedMetadata | 
    DescriptionUpdatedMetadata | 
    TaskCreatedMetadata |
    StartedWorkMetadata |
    FinishedWorkMetadata

export enum ActivityType {
    TASK_CREATED = 'TaskCreated',
    COMMENT_LEFT = 'CommentLeft',
    TITLE_UPDATED = 'TaskDetailsUpdated',
    DESCRIPTION_UPDATED = 'DescriptionUpdated',
    WORKFLOW_RUN = 'WorkflowRun',
    STARTED_WORK = 'StartedWork',
    FINISHED_WORK = 'FinishedWork'
}

export type PaginationData = {
    pageNumber: number
    pageSize: number
}

export const DefaultPagination: PaginationData = {
    pageNumber: 1,
    pageSize: 5,
}

export type ActivityData = {
    id: string
    type: ActivityType
    projectId: string
    taskId: string
    userId: string
    metadata: ActivityMetadata
    occurredAt: string
}