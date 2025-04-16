import { TicketActivity } from "@domain/entities/activities/ticket-activity"
import { Comment } from "@domain/entities/activities/comment"
export interface TicketActivityManager {
    createComment(initiatorName: string, ticketId: string, comment: Comment): TicketActivity<Comment>
}