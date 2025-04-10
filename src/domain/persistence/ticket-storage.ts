import { Ticket } from "@domain/entities/ticket"

export interface TicketStorage {
	save(ticket: Ticket): Promise<Ticket>
	findById(ticketId: string): Promise<Ticket | null>
	findAll(projectId: string): Promise<Ticket[]>
}
