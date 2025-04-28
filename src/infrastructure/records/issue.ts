
enum IssueStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
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