import { Ticket } from "@domain/entities/ticket"
import { TicketDto } from "@application/dto/ticket"
import { TicketRepository } from "@domain/repositories/ticket-repository"
import { UpdateTicketDescription } from "@domain/use-cases/ticket/update-description"

export class UpdateTicketDescriptionUseCase implements UpdateTicketDescription{
	constructor(
		private readonly ticketRepository: TicketRepository
	) {}

	async execute(ticketDto: TicketDto): Promise<Ticket> {
		try {
			// fetch the old ticket and update it
			console.log(`Updating ticket description for ticket ${ticketDto.id} to ${ticketDto.description}.`)
            const ticket: Ticket | null = await this.ticketRepository.findById(ticketDto.id)

            if (!ticket) {
                throw new Error("Ticket not found.")
            }

            ticket.updateDescription(ticketDto.description)

			// Persist the ticket in the database
			return await this.ticketRepository.save(ticket)
		} catch (error) {
			console.error("Error during ticket description update:", error)
			throw new Error("Failed to edit ticket description.")
		}
	}
}
