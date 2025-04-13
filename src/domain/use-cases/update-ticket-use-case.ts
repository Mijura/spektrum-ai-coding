
import { TicketDto } from "@application/dto/ticket"
import { Ticket } from "@domain/entities/ticket"

export interface UpdateTicketUseCase {
    execute(ticket: TicketDto): Promise<Ticket>
}
