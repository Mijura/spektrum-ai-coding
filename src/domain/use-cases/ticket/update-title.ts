
import { TicketDto } from "@application/dto/ticket"
import { Ticket } from "@domain/entities/ticket"

export interface UpdateTicketTitle {
    execute(ticket: TicketDto): Promise<Ticket>
}
