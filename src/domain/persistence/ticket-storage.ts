import { Ticket } from "@domain/entities/ticket"

export interface TicketStorage {
	save(ticket: Ticket): Promise<Ticket>
	findAll(projectId: string): Promise<Ticket[]>
}
