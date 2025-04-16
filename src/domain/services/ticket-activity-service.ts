import { TicketActivity } from "@domain/entities/activities/ticket-activity"
import { Comment } from "@domain/entities/activities/comment"
import { Ticket } from "@domain/entities/ticket"
export interface TicketActivityServicePort {
    createComment(initiatorName: string, ticketId: string, content: string): TicketActivity<Comment>
    createTicket(initiatorName: string, title: string, description: string): TicketActivity<Ticket>
}