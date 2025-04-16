import { TicketActivityType } from "@domain/entities/activities/ticket-activity"


enum TicketStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

export interface ActorDto {
	id: string
	name: string
}

export interface CommentDto {
	id: string
	content: string
}

export interface TicketActivityDto {
	id: string
	actor: ActorDto
	data: CommentDto
	metadata: TicketActivityMetadataDto
}

export interface TicketActivityMetadataDto {
	created: string
	actor: ActorDto
	type: TicketActivityType
}

export interface TicketDto {
	id: string
	title: string
	description: string
	projectId: string
	created: string
	updated: string | null
	status: TicketStatus
	activities: TicketActivityDto[]
}