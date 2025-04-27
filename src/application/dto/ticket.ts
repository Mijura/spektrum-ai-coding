import { ActivityType } from "@domain/entities/activity/types/activity-type"
import { ActivityMetadata } from "@domain/entities/activity/types/activity-metadata"


enum TicketStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

export interface ActivityDto {
	id: string
	type: ActivityType
	ticketId: string
	userId: string
	metadata: ActivityMetadata
	occurredAt: string
}

export interface CommentDto {
	id: string
	authorId: string
	text: string
	createdAt: string
	editedAt: string | null
}

export interface TicketDto {
	id: string
	title: string
	description: string
	projectId: string
	created: string
	updated: string | null
	status: TicketStatus
	comments: CommentDto[]
	activities: ActivityDto[]
}