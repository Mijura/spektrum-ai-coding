
import { Ticket } from "@domain/entities/ticket"

export interface CreateTicket {
    execute(projectId: string, title: string, description: string): Promise<Ticket>
}
