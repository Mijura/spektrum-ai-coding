import { Ticket } from "@domain/entities/ticket"

export interface EditComment {
    execute(ticketId: string, userId: string, commentId: string, newText: string): Promise<Ticket>
} 