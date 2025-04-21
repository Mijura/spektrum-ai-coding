
import { ActivityMetadata, ActivityType } from "@domain/entities/activity"


enum TicketStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

interface ActivityRecord {
	id: string
	type: ActivityType
	ticketId: string
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

export interface TicketRecord {
	id: string
	title: string
	description: string
	projectId: string
	created: string
	updated: string | null
	status: TicketStatus
	comments: CommentRecord[]
	activities: ActivityRecord[]
}