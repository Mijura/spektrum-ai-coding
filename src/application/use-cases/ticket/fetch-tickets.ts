import { Ticket } from "@domain/entities/ticket"
import { TicketRepository } from "@domain/repositories/ticket-repository"
import { FetchTickets } from "@domain/use-cases/ticket/fetch-tickets"

export class FetchTicketsUseCase implements FetchTickets {
	constructor(private readonly ticketRepository: TicketRepository) {}

	async execute(projectId: string): Promise<Ticket[]> {
		return await this.ticketRepository.findAll(projectId)
	}
}
