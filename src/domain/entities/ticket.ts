import { v4 as uuidv4 } from "uuid"

export enum TicketStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

export class Ticket {
	public readonly id: string
    public readonly created: string
    public readonly updated: string | null
    public title: string
    public description: string
    public projectId: string
    public status: TicketStatus
	
    private constructor(
		id: string,
		projectId: string,
		title: string,
		description: string,
		status: TicketStatus,
        created: string,
		updated: string | null
	) {
		this.id = id
		this.projectId = projectId
		this.title = title
		this.description = description
		this.status = status
		this.created = created
		this.updated = updated
	}

	// Factory method to create a new ticket
	static create(projectId: string, title: string, description: string): Ticket {
		const id = uuidv4() // Generate unique ID
		const created = new Date().toISOString() // ISO format
	
		return new Ticket(id, projectId, title, description, TicketStatus.TODO, created, null)
	}

	/** Restore method to rehydrate a ticket from persisted data */
	static restore(data: {
		id: string
		projectId: string
        title: string
        description: string
        status: TicketStatus
        created: string
        updated: string | null
	}): Ticket {
		return new Ticket(data.id, data.projectId, data.title, data.description, data.status, data.created, data.updated)
	}


}
