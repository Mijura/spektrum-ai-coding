enum TicketStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

export interface TicketDto {
	id: string
	title: string
	description: string
	projectId: string
	created: string
	updated: string | null
	status: TicketStatus
}