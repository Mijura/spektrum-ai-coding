import { Ticket } from "@domain/entities/ticket"
import { TicketDto } from "@application/dto/ticket"
import { TicketFactory } from "@domain/factories/ticket-factory"
export class TicketMapper {

	/** Convert Ticket entity → marshalled ticket for storage/transfer */
	static toDto(ticket: Ticket): TicketDto {
		return {
			id: ticket.id,
			projectId: ticket.projectId,
			title: ticket.title,
			description: ticket.description,
			status: ticket.status,
			created: ticket.created,
			updated: ticket.updated,
			activities: []
		}
	}

	static toDtos(tickets: Ticket[]): TicketDto[] {
		let ticketDtos: TicketDto[] = []
		for (const ticket of tickets) {
			ticketDtos.push(this.toDto(ticket))
		}
		return ticketDtos
	}

	/** Convert marshalled ticket (e.g., from DB) → Ticket entity */
	static toDomain(data: TicketDto): Ticket {
		return TicketFactory.restore(data)
	}

	static toDomains(items: TicketDto[]): Ticket[] {
		let tickets: Ticket[] = []
		for (const ticket of items) {
			tickets.push(this.toDomain(ticket))
		}
		return tickets
	}
}
