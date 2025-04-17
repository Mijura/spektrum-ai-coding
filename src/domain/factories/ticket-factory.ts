import { Ticket, TicketStatus } from "@domain/entities/ticket"
import { TicketDto } from "@application/dto/ticket"
import { v4 as uuidv4 } from 'uuid';

export class TicketFactory{

    /** Restore method to rehydrate a ticket from persisted data */
	static restore(data: TicketDto): Ticket {
		return new Ticket(data.id, data.created, data.projectId, data.title, data.description, data.status, data.updated, [])
	}

	static create(projectId: string, title: string, description: string): Ticket {
		const id = uuidv4()
		const created = new Date().toISOString()
		return new Ticket(id, created, projectId, title, description, TicketStatus.TODO, null, [])
	}
}