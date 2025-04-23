import { Ticket } from "@domain/entities/ticket"
import { LeaveComment } from "@domain/use-cases/ticket/leave-comment"
import { TicketRepository } from "@domain/repositories/ticket-repository"

export class LeaveCommentUseCase implements LeaveComment {
    constructor(
        private readonly ticketRepository: TicketRepository
    ) {}

    async execute(ticketId: string, authorId: string, commentText: string): Promise<Ticket> {
        try {
            console.log(`Adding comment to ticket ${ticketId} by user ${authorId}.`)
            const ticket: Ticket | null = await this.ticketRepository.findById(ticketId)

            if (!ticket) {
                throw new Error("Ticket not found.")
            }

            ticket.leaveComment(authorId, commentText)

            return await this.ticketRepository.save(ticket)
        } catch (error) {
            console.error("Error during adding comment:", error)
            throw new Error("Failed to add comment.")
        }
    }
} 