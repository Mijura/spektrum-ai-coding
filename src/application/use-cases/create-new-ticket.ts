import { CreateTicketUseCase } from "@domain/use-cases/create-ticket-use-case"
import { Ticket } from "@domain/entities/ticket"
import { TicketStorage } from "@domain/persistence/ticket-storage"
import { TicketFactory } from "@domain/factories/ticket-factory"

export class CreateNewTicket implements CreateTicketUseCase {
	constructor(
		private readonly ticketStorage: TicketStorage
	) {}

	async execute(projectId: string, title: string, description: string): Promise<Ticket> {
		try {
			// Create a new ticket
			const ticket: Ticket = TicketFactory.create(projectId, title, description)

			// Persist the ticket in the database
			return await this.ticketStorage.save(ticket)
		} catch (error) {
			console.error("Error creating new ticket:", error)
			throw new Error("Failed to create new ticket.")
		}
	}
}
