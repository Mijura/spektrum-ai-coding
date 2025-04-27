
import { ActivityMetadata, ActivityType } from "@domain/entities/activity"


enum IssueStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

interface ActivityRecord {
	id: string
	type: ActivityType
	issueId: string
	userId: string
	metadata: ActivityMetadata
	occurredAt: string
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