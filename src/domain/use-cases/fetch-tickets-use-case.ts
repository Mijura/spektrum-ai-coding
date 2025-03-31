import { Ticket } from "@domain/entities/ticket"

export interface FetchTicketsUseCase {
    execute(projectId: string): Promise<Ticket[]> 
}

