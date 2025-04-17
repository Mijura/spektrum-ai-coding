import { Ticket } from "@domain/entities/ticket"

export interface FetchTickets {
    execute(projectId: string): Promise<Ticket[]> 
}

