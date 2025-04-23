import { Ticket } from "@domain/entities/ticket"
import { EditComment } from "@domain/use-cases/ticket/edit-comment"
import { TicketRepository } from "@domain/repositories/ticket-repository"

export class EditCommentUseCase implements EditComment {
    constructor(
        private readonly ticketRepository: TicketRepository
    ) {}

    async execute(ticketId: string, userId: string, commentId: string, newText: string): Promise<Ticket> {
        try {
            console.log(`Editing comment ${commentId} on ticket ${ticketId} by user ${userId}.`)
            const ticket: Ticket | null = await this.ticketRepository.findById(ticketId)

            if (!ticket) {
                throw new Error("Ticket not found.")
            }

            ticket.editComment(userId, commentId, newText)

            return await this.ticketRepository.save(ticket)
        } catch (error) {
            console.error("Error during editing comment:", error)
            throw new Error("Failed to edit comment.")
        }
    }
} 