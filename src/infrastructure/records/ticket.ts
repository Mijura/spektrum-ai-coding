
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
	editedAt?: string
}

export interface TicketRecord {
	id: string
	created: string
	projectId: string
	title: string
	description: string
	updated: string | null
	status: TicketStatus
	comments: CommentRecord[]
	activities: ActivityRecord[]
}