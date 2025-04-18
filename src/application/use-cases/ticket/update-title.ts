import { Ticket } from "@domain/entities/ticket"
import { UpdateTicketTitle } from "@domain/use-cases/ticket/update-title"
import { TicketDto } from "@application/dto/ticket"
import { TicketRepository } from "@domain/repositories/ticket-repository"

export class UpdateTicketTitleUseCase implements UpdateTicketTitle{
	constructor(
		private readonly ticketRepository: TicketRepository
	) {}

	async execute(ticketDto: TicketDto): Promise<Ticket> {
		try {
			// fetch the old ticket and update it

			console.log(`Updating ticket title for ticket ${ticketDto.id} to ${ticketDto.title}.`)
            const ticket: Ticket | null = await this.ticketRepository.findById(ticketDto.id)

            if (!ticket) {
                throw new Error("Ticket not found.")
            }

			// TODO: Get the user id from the context
            ticket.updateTitle('User', ticketDto.title)

			// Persist the ticket in the database
			return await this.ticketRepository.save(ticket)
		} catch (error) {
			console.error("Error during ticket title update:", error)
			throw new Error("Failed to edit ticket title.")
		}
	}
}
