import { Ticket } from "@domain/entities/ticket"

export interface LeaveComment {
    execute(ticketId: string, authorId: string, commentText: string): Promise<Ticket>
} 