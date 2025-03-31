
import { Ticket } from "@domain/entities/ticket"

export interface CreateTicketUseCase {
    execute(projectId: string, title: string, description: string): Promise<Ticket>
}
