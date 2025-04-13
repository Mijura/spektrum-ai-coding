import { Ticket } from "@domain/entities/ticket"
import { TicketStorage } from "@domain/persistence/ticket-storage"
import { UpdateTicketUseCase } from "@domain/use-cases/update-ticket-use-case"
import { TicketDto } from "@application/dto/ticket"

export class UpdateTicket implements UpdateTicketUseCase {
	constructor(
		private readonly ticketStorage: TicketStorage
	) {}

	async execute(ticketDto: TicketDto): Promise<Ticket> {
		try {
			// fetch the old ticket and update it
            const ticket: Ticket | null = await this.ticketStorage.findById(ticketDto.id)

            if (!ticket) {
                throw new Error("Ticket not found.")
            }

            ticket.update(ticketDto)

			// Persist the ticket in the database
			return await this.ticketStorage.save(ticket)
		} catch (error) {
			console.error("Error creating new ticket:", error)
			throw new Error("Failed to create new ticket.")
		}
	}
}
