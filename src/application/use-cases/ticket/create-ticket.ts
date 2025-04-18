import { CreateTicket } from "@domain/use-cases/ticket/create-ticket"
import { Ticket } from "@domain/entities/ticket"
import { TicketRepository } from "@domain/repositories/ticket-repository"

export class CreateTicketUseCase implements CreateTicket {
	constructor(
		private readonly ticketRepository: TicketRepository
	) {}

	async execute(projectId: string, title: string, description: string): Promise<Ticket> {
		try {
			// Create a new ticket
			// TODO: Get the user id from the request
			const ticket: Ticket = Ticket.create('user', projectId, title, description)

			// Persist the ticket in the database
			return await this.ticketRepository.save(ticket)
		} catch (error) {
			console.error("Error creating new ticket:", error)
			throw new Error("Failed to create new ticket.")
		}
	}
}
