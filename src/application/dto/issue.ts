import { ActivityData } from "@domain/types/activity"

enum IssueStatus {
    TODO = "Todo",
    IN_PROGRESS = "In progress",
    DONE = "Done",
}

export interface CommentDto {
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
	activities: ActivityData[]
}