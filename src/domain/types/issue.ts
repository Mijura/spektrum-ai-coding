
export enum IssueStatus {
    TODO = "Todo",
    WORK_IN_PROGRESS = "Work in progress",
	READY_FOR_NEXT_PHASE = "Ready for next phase",
    DONE = "Done",
}

export interface CommentData {
	id: string
	authorId: string
	text: string
	createdAt: string
	editedAt: string | null
}

export interface IssueDto {
	id: string
	title: string
	description: string
	projectId: string
	created: string
	updated: string | null
	status: IssueStatus
	comments: CommentData[]
}