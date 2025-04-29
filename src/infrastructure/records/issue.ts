
enum IssueStatus {
    TODO = "Todo",
    IN_PROGRESS = "In progress",
    DONE = "Done",
}
interface CommentRecord {
	id: string
	authorId: string
	text: string
	createdAt: string
	editedAt: string | null
}

export interface IssueRecord {
	id: string
	title: string
	description: string
	projectId: string
	created: string
	updated: string | null
	status: IssueStatus
	comments: CommentRecord[]
}