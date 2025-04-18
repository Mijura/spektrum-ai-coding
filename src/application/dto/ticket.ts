import { ActivityMetadata, ActivityType } from "@domain/entities/activity"


enum TicketStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

export interface ActivityDto {
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
	editedAt?: string
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