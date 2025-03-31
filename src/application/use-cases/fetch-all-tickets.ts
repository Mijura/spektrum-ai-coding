import { TicketStorage } from "@domain/persistence/ticket-storage"
import { Ticket } from "@domain/entities/ticket"
import { FetchTicketsUseCase } from "@domain/use-cases/fetch-tickets-use-case"

export class FetchAllTickets implements FetchTicketsUseCase {
	constructor(private readonly ticketStorage: TicketStorage) {}

	async execute(projectId: string): Promise<Ticket[]> {
		return await this.ticketStorage.findAll(projectId)
	}
}
