import { Ticket, TicketStatus } from "@domain/entities/ticket"
import { TicketDto } from "@application/dto/ticket"


export class TicketFactory{

    /** Restore method to rehydrate a ticket from persisted data */
	static restore(data: TicketDto): Ticket {
		return new Ticket(data.projectId, data.title, data.description, data.status, data.updated, [])
	}

	static create(projectId: string, title: string, description: string): Ticket {
		return new Ticket(projectId, title, description, TicketStatus.TODO, null, [])
	}
}